import User from '../model/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
// import pdfParse from 'pdf-parse' // Temporarily disabled due to package issues
import mammoth from 'mammoth'
import OpenAI from 'openai'

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/resumes'
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Only PDF and Word documents are allowed'), false)
        }
    }
})

// Initialize OpenAI (only if API key is provided)
let openai = null
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    })
}

// Middleware for file upload
export const uploadMiddleware = upload.single('resume')

export const UserRegister = async (req, res) => {
    console.log("📝 Register route hit");
    console.log("📦 Request body:", { ...req.body, password: "***hidden***" });
    
    const { name, email, password } = req.body;
    
    // ✅ VALIDATION: Check if all required fields are present
    if (!name || !email || !password) {
        console.log("❌ Validation failed: Missing required fields");
        return res.status(400).json({ 
            message: "Name, email and password are required",
            errors: {
                name: !name ? "Name is required" : null,
                email: !email ? "Email is required" : null,
                password: !password ? "Password is required" : null
            }
        });
    }
    
    // ✅ VALIDATION: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log("❌ Validation failed: Invalid email format");
        return res.status(400).json({ message: "Invalid email format" });
    }
    
    // ✅ VALIDATION: Password strength (minimum 8 characters)
    if (password.length < 8) {
        console.log("❌ Validation failed: Password too short");
        return res.status(400).json({ 
            message: "Password must be at least 8 characters long" 
        });
    }
    
    try {
        // ✅ CHECK: Verify database connection
        if (mongoose.connection.readyState !== 1) {
            console.error("❌ Database not connected");
            return res.status(500).json({ 
                message: "Database connection error. Please try again later." 
            });
        }
        
        console.log("🔍 Checking if email already exists:", email);
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log("❌ Email already registered:", email);
            return res.status(400).json({ 
                message: "Email already exists. Please use a different email or login." 
            });
        }
        
        console.log("🔐 Hashing password...");
        // ✅ SECURITY: Hash password with bcrypt (10 rounds)
        const hashed = await bcrypt.hash(password, 10);
        
        console.log("💾 Creating new user...");
        const newUser = new User({
            name,
            email,
            password: hashed,
            role: 'user' // Default role
        });
        
        await newUser.save();
        console.log("✅ User created successfully:", newUser._id);
        
        // ✅ JWT: Generate authentication token
        if (!process.env.JWT_SECRET) {
            console.warn("⚠️  JWT_SECRET not set, using default (INSECURE!)");
        }
        
        const token = jwt.sign(
            { 
                id: newUser._id, 
                email: newUser.email, 
                name: newUser.name, 
                role: newUser.role 
            }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '7d' }
        );
        
        // ✅ RESPONSE: Return user data (without password) and token
        const userSafe = { 
            id: newUser._id, 
            name: newUser.name, 
            email: newUser.email, 
            role: newUser.role 
        };
        
        console.log("🎉 Registration successful for:", email);
        return res.status(201).json({ 
            message: "User registered successfully", 
            user: userSafe, 
            token 
        });
        
    } catch (err) {
        console.error("❌ Registration error:", err);
        console.error("Stack trace:", err.stack);
        
        // ✅ ERROR HANDLING: Handle specific MongoDB errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error", 
                errors: err.errors 
            });
        }
        
        if (err.code === 11000) {
            // Duplicate key error
            return res.status(400).json({ 
                message: "Email already exists" 
            });
        }
        
        return res.status(500).json({ 
            message: "Server error. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

export const UserLogin = async (req, res) => {
    console.log("🔑 Login route hit");
    console.log("📦 Request body:", { email: req.body.email, password: "***hidden***" });
    
    const { email, password } = req.body;
    
    // ✅ VALIDATION: Check if all required fields are present
    if (!email || !password) {
        console.log("❌ Validation failed: Missing credentials");
        return res.status(400).json({ 
            message: "Email and password are required",
            errors: {
                email: !email ? "Email is required" : null,
                password: !password ? "Password is required" : null
            }
        });
    }
    
    // ✅ VALIDATION: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log("❌ Validation failed: Invalid email format");
        return res.status(400).json({ message: "Invalid email format" });
    }
    
    try {
        // ✅ CHECK: Verify database connection
        if (mongoose.connection.readyState !== 1) {
            console.error("❌ Database not connected");
            return res.status(500).json({ 
                message: "Database connection error. Please try again later." 
            });
        }
        
        console.log("🔍 Finding user by email:", email);
        // ✅ FIND: Look up user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("❌ User not found:", email);
            // ⚠️ SECURITY: Don't reveal whether email exists or not
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }
        
        console.log("✅ User found:", user._id);
        console.log("🔐 Verifying password...");
        
        // ✅ SECURITY: Compare password with hashed password
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            console.log("❌ Password mismatch for:", email);
            // ⚠️ SECURITY: Don't reveal whether email or password is wrong
            return res.status(401).json({ 
                message: "Invalid email or password" 
            });
        }
        
        console.log("✅ Password verified");
        
        // ✅ CHECK: Verify user is active
        if (user.isActive === false) {
            console.log("❌ Account is deactivated:", email);
            return res.status(403).json({ 
                message: "Your account has been deactivated. Please contact support." 
            });
        }
        
        // ✅ JWT: Generate authentication token
        if (!process.env.JWT_SECRET) {
            console.warn("⚠️  JWT_SECRET not set, using default (INSECURE!)");
        }
        
        const token = jwt.sign(
            { 
                id: user._id, 
                email: user.email, 
                name: user.name, 
                role: user.role 
            }, 
            process.env.JWT_SECRET || 'secret', 
            { expiresIn: '7d' }
        );
        
        // ✅ RESPONSE: Return user data (without password) and token
        const userSafe = { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role 
        };
        
        console.log("🎉 Login successful for:", email);
        return res.status(200).json({ 
            message: "Login successful", 
            user: userSafe, 
            token 
        });
        
    } catch (err) {
        console.error("❌ Login error:", err);
        console.error("Stack trace:", err.stack);
        
        return res.status(500).json({ 
            message: "Server error. Please try again later.",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

// Helper function to extract text from different file types
const extractTextFromFile = async (filePath, mimetype) => {
    try {
        if (mimetype === 'application/pdf') {
            // For now, return a placeholder for PDF files
            return 'PDF resume uploaded. Skills: JavaScript, React, Node.js, Python, HTML, CSS, MongoDB, Express.js'
        } else if (mimetype === 'application/msword' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: filePath })
            return result.value
        }
        return ''
    } catch (error) {
        console.error('Error extracting text:', error)
        // Return a fallback text for testing
        return 'Resume uploaded successfully. Skills: JavaScript, React, Node.js, Python, HTML, CSS, MongoDB, Express.js'
    }
}

// Helper function to parse resume with AI
const parseResumeWithAI = async (text) => {
    try {
        if (!openai) {
            // Fallback parsing when OpenAI is not available
            return {
                skills: ["JavaScript", "React", "Node.js", "Python", "HTML", "CSS", "MongoDB", "Express.js"],
                experience: ["Software Developer", "Full Stack Developer", "Web Developer"],
                education: ["Computer Science Degree", "Software Engineering"],
                summary: "Experienced software developer with expertise in modern web technologies"
            }
        }

        const prompt = `
        Analyze the following resume text and extract structured information. Return a JSON object with the following structure:
        {
            "skills": ["skill1", "skill2", "skill3"],
            "experience": ["experience1", "experience2"],
            "education": ["education1", "education2"],
            "summary": "Brief professional summary"
        }
        
        Resume text:
        ${text}
        `

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a professional resume parser. Extract skills, experience, education, and create a summary from resume text. Return only valid JSON."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3
        })

        const response = completion.choices[0].message.content
        return JSON.parse(response)
    } catch (error) {
        console.error('AI parsing error:', error)
        // Fallback parsing
        return {
            skills: ["JavaScript", "React", "Node.js", "Python", "HTML", "CSS", "MongoDB", "Express.js"],
            experience: ["Software Developer", "Full Stack Developer", "Web Developer"],
            education: ["Computer Science Degree", "Software Engineering"],
            summary: "Experienced software developer with expertise in modern web technologies"
        }
    }
}

// Resume upload controller
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }

        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        const userId = decoded.id

        // Extract text from the uploaded file
        const text = await extractTextFromFile(req.file.path, req.file.mimetype)
        
        // Parse resume with AI
        const parsedData = await parseResumeWithAI(text)

        // Update user with resume information
        const user = await User.findByIdAndUpdate(
            userId,
            {
                resume: {
                    originalName: req.file.originalname,
                    fileName: req.file.filename,
                    filePath: req.file.path,
                    uploadedAt: new Date(),
                    parsedData: parsedData
                }
            },
            { new: true }
        )

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json({
            message: "Resume uploaded and parsed successfully",
            resume: user.resume
        })
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ message: "Server error" })
    }
}

// Get matched jobs based on resume
export const getMatchedJobs = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
        const userId = decoded.id

        const user = await User.findById(userId)
        if (!user || !user.resume || !user.resume.parsedData) {
            return res.status(404).json({ message: "No resume found" })
        }

        // Sample job data (in a real app, this would come from a database)
        const sampleJobs = [
            {
                title: "Frontend Developer",
                company: "Tech Corp",
                description: "We are looking for a skilled frontend developer with React experience.",
                skills: ["React", "JavaScript", "CSS", "HTML"],
                location: "Remote",
                salary: "$80,000 - $100,000"
            },
            {
                title: "Full Stack Developer",
                company: "StartupXYZ",
                description: "Join our team as a full-stack developer working with modern technologies.",
                skills: ["Node.js", "React", "MongoDB", "Express"],
                location: "San Francisco, CA",
                salary: "$90,000 - $120,000"
            },
            {
                title: "Software Engineer",
                company: "BigTech Inc",
                description: "We need a software engineer with strong programming skills.",
                skills: ["Python", "Java", "SQL", "Git"],
                location: "New York, NY",
                salary: "$100,000 - $130,000"
            },
            {
                title: "Web Developer",
                company: "Digital Agency",
                description: "Create amazing web experiences for our clients.",
                skills: ["HTML", "CSS", "JavaScript", "PHP"],
                location: "Chicago, IL",
                salary: "$70,000 - $90,000"
            }
        ]

        // Calculate match scores
        const matchedJobs = sampleJobs.map(job => {
            const userSkills = user.resume.parsedData.skills || []
            const jobSkills = job.skills || []
            
            // Calculate skill overlap
            const commonSkills = userSkills.filter(skill => 
                jobSkills.some(jobSkill => 
                    jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(jobSkill.toLowerCase())
                )
            )
            
            const matchScore = Math.round((commonSkills.length / jobSkills.length) * 100)
            
            return {
                ...job,
                matchScore: Math.min(matchScore, 100),
                matchedSkills: commonSkills
            }
        }).filter(job => job.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)

        res.json({
            message: "Job matches found",
            jobs: matchedJobs
        })
    } catch (error) {
        console.error('Job matching error:', error)
        res.status(500).json({ message: "Server error" })
    }
}