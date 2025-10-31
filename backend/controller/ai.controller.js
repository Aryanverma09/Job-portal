import OpenAI from 'openai'
import User from '../model/user.model.js'
import Job from '../model/job.model.js'
import Application from '../model/application.model.js'
import jwt from 'jsonwebtoken'

// Initialize OpenAI if API key is available
let openai = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  })
}

// AI Job Recommendations
export const getJobRecommendations = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id

    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Get user's past applications and extract job preferences
    const userApplications = await Application.find({ applicant: userId })
      .populate('job')
      .lean()

    const appliedJobIds = userApplications.map(app => app.job._id.toString())
    
    // Get all jobs excluding already applied ones
    const allJobs = await Job.find({
      _id: { $nin: appliedJobIds }
    }).lean()

    // Extract user skills from resume
    const userSkills = user.resume?.parsedData?.skills || []
    const userExperience = user.resume?.parsedData?.experience || []
    const userLocation = user.location || ''

    // If OpenAI is available, use AI for recommendations
    if (openai) {
      try {
        const jobDescriptions = allJobs.map(job => ({
          id: job._id.toString(),
          title: job.title,
          company: job.company,
          skills: job.skills || [],
          description: job.description || '',
          location: job.location || ''
        }))

        const prompt = `
          Analyze the following user profile and recommend the top 5 jobs that best match their skills and experience.
          
          User Profile:
          - Skills: ${userSkills.join(', ')}
          - Experience: ${userExperience.join(', ')}
          - Location Preference: ${userLocation}
          - Past Applied Jobs: ${userApplications.map(app => app.job?.title || '').join(', ')}
          
          Available Jobs:
          ${JSON.stringify(jobDescriptions, null, 2)}
          
          Return a JSON array of job IDs sorted by relevance (most relevant first), with a match score (0-100) and brief explanation for each.
          Format: [{"jobId": "id", "matchScore": 95, "reason": "explanation"}]
        `

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a job recommendation engine. Analyze user profiles and job requirements to provide personalized job recommendations. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })

        const recommendations = JSON.parse(completion.choices[0].message.content)
        const recommendedJobIds = recommendations.map(rec => rec.jobId)

        // Get recommended jobs
        const recommendedJobs = allJobs
          .filter(job => recommendedJobIds.includes(job._id.toString()))
          .map(job => {
            const rec = recommendations.find(r => r.jobId === job._id.toString())
            return {
              id: job._id.toString(),
              title: job.title,
              company: job.company,
              location: job.location,
              salary: job.salary,
              type: job.type,
              skills: job.skills,
              description: job.description,
              matchScore: rec?.matchScore || 0,
              matchReason: rec?.reason || ''
            }
          })

        return res.json({
          recommendations: recommendedJobs,
          message: 'AI-powered recommendations generated'
        })
      } catch (aiError) {
        console.error('AI recommendation error:', aiError)
        // Fall through to non-AI recommendations
      }
    }

    // Fallback: Simple skill-based matching
    const recommendations = allJobs.map(job => {
      const jobSkills = job.skills || []
      const commonSkills = userSkills.filter(skill =>
        jobSkills.some(jobSkill =>
          jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      )
      const matchScore = jobSkills.length > 0
        ? Math.round((commonSkills.length / jobSkills.length) * 100)
        : 0

      return {
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        skills: job.skills,
        description: job.description,
        matchScore,
        matchReason: matchScore > 0
          ? `Matches ${commonSkills.length} of ${jobSkills.length} required skills`
          : 'No skill matches found'
      }
    })
      .filter(job => job.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)

    res.json({
      recommendations,
      message: 'Recommendations generated'
    })
  } catch (error) {
    console.error('Job recommendations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AI Resume Analyzer
export const analyzeResume = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id

    const user = await User.findById(userId).lean()
    if (!user || !user.resume || !user.resume.parsedData) {
      return res.status(404).json({ message: 'No resume found. Please upload a resume first.' })
    }

    const resumeData = user.resume.parsedData
    const resumeText = `Skills: ${resumeData.skills?.join(', ') || 'None'}
Experience: ${resumeData.experience?.join(', ') || 'None'}
Education: ${resumeData.education?.join(', ') || 'None'}
Summary: ${resumeData.summary || 'None'}`

    let analysis = {
      strengths: [],
      weaknesses: [],
      suggestions: [],
      missingSkills: [],
      keywords: resumeData.skills || [],
      score: 0
    }

    if (openai) {
      try {
        const prompt = `
          Analyze the following resume and provide detailed feedback in JSON format:
          
          Resume:
          ${resumeText}
          
          Return a JSON object with:
          {
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "suggestions": ["suggestion1", "suggestion2"],
            "missingSkills": ["skill1", "skill2"],
            "keywords": ["keyword1", "keyword2"],
            "score": 85,
            "formatting": "feedback on formatting",
            "contentQuality": "feedback on content"
          }
        `

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional resume analyzer. Provide constructive feedback to help job seekers improve their resumes. Return only valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3
        })

        analysis = JSON.parse(completion.choices[0].message.content)
      } catch (aiError) {
        console.error('AI resume analysis error:', aiError)
        // Fallback analysis
        analysis = generateFallbackAnalysis(resumeData)
      }
    } else {
      analysis = generateFallbackAnalysis(resumeData)
    }

    res.json({
      analysis,
      message: 'Resume analyzed successfully'
    })
  } catch (error) {
    console.error('Resume analysis error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const generateFallbackAnalysis = (resumeData) => {
  const skills = resumeData.skills || []
  const experience = resumeData.experience || []
  const education = resumeData.education || []

  const strengths = []
  const weaknesses = []
  const suggestions = []

  if (skills.length >= 5) {
    strengths.push('Strong technical skillset')
  } else {
    weaknesses.push('Limited skills listed')
    suggestions.push('Add more relevant skills to your resume')
  }

  if (experience.length > 0) {
    strengths.push('Has work experience')
  } else {
    weaknesses.push('No work experience listed')
    suggestions.push('Add relevant experience or projects')
  }

  if (education.length > 0) {
    strengths.push('Educational background included')
  } else {
    suggestions.push('Add your educational qualifications')
  }

  if (!resumeData.summary || resumeData.summary.length < 50) {
    weaknesses.push('Missing or brief professional summary')
    suggestions.push('Add a compelling professional summary (50-100 words)')
  }

  const score = Math.min(
    Math.round(
      (skills.length * 10) +
      (experience.length * 15) +
      (education.length * 10) +
      (resumeData.summary ? 20 : 0)
    ),
    100
  )

  return {
    strengths,
    weaknesses,
    suggestions,
    missingSkills: ['Leadership', 'Communication', 'Project Management'],
    keywords: skills,
    score,
    formatting: 'Ensure consistent formatting and clear sections',
    contentQuality: score > 70 ? 'Good content quality' : 'Content needs improvement'
  }
}

// AI Cover Letter Generator
export const generateCoverLetter = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' })
    }

    const user = await User.findById(userId).lean()
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const job = await Job.findById(jobId).lean()
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    const resumeData = user.resume?.parsedData || {}
    const userSkills = resumeData.skills || []
    const userExperience = resumeData.experience || []

    let coverLetter = ''

    if (openai) {
      try {
        const prompt = `
          Generate a professional cover letter for the following job application:
          
          Job Details:
          - Title: ${job.title}
          - Company: ${job.company}
          - Description: ${job.description || 'Not provided'}
          - Required Skills: ${job.skills?.join(', ') || 'Not specified'}
          - Requirements: ${job.requirements?.join(', ') || 'Not specified'}
          
          Applicant Profile:
          - Name: ${user.name}
          - Skills: ${userSkills.join(', ')}
          - Experience: ${userExperience.join(', ')}
          - Summary: ${resumeData.summary || 'Experienced professional'}
          
          Generate a professional, personalized cover letter (300-400 words) that:
          1. Addresses the hiring manager
          2. Highlights relevant skills and experience
          3. Explains interest in the position
          4. Demonstrates alignment with job requirements
          5. Includes a professional closing
          
          Return only the cover letter text, no additional formatting or explanations.
        `

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional career advisor. Generate compelling, personalized cover letters that highlight the candidate\'s strengths and alignment with the job requirements. Be professional, concise, and specific.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7
        })

        coverLetter = completion.choices[0].message.content.trim()
      } catch (aiError) {
        console.error('AI cover letter generation error:', aiError)
        // Fallback cover letter
        coverLetter = generateFallbackCoverLetter(user, job, resumeData)
      }
    } else {
      coverLetter = generateFallbackCoverLetter(user, job, resumeData)
    }

    res.json({
      coverLetter,
      message: 'Cover letter generated successfully'
    })
  } catch (error) {
    console.error('Cover letter generation error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

const generateFallbackCoverLetter = (user, job, resumeData) => {
  const userSkills = resumeData.skills || []
  const matchedSkills = userSkills.filter(skill =>
    job.skills?.some(jobSkill =>
      jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(jobSkill.toLowerCase())
    )
  )

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job.title} position at ${job.company}. With my background in ${matchedSkills.slice(0, 3).join(', ')}, I am confident that I would be a valuable addition to your team.

In my previous roles, I have developed expertise in ${resumeData.skills?.slice(0, 4).join(', ') || 'relevant technologies'}, which align well with the requirements for this position. ${resumeData.summary || 'I am a dedicated professional with a passion for delivering high-quality results.'}

I am particularly drawn to ${job.company} because of ${job.description ? 'your commitment to innovation and excellence' : 'the opportunity to contribute to your team'}. I am excited about the possibility of bringing my skills and experience to this role and contributing to your company's continued success.

Thank you for considering my application. I look forward to the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team.

Sincerely,
${user.name}`
}

