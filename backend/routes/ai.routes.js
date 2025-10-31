import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import { callGemini, callOpenAI } from '../utils/ai-helper.js'

const AIRoutes = express.Router()

// AI Interview Preparation
AIRoutes.post('/interview', requireAuth, async (req, res) => {
  try {
    const { jobTitle, jobDescription } = req.body
    const userId = req.user.id || req.user._id

    if (!jobTitle && !jobDescription) {
      return res.status(400).json({ error: 'Job title or description is required' })
    }

    // Get user profile for personalization
    const User = (await import('../model/user.model.js')).default
    const mongoose = await import('mongoose')
    let user = null
    try {
      user = await User.findById(new mongoose.default.Types.ObjectId(userId)).lean()
    } catch (err) {
      // If user not found or invalid ID, use empty profile
      console.warn('User not found for interview generation:', userId)
    }
    
    const userProfile = {
      skills: user?.resume?.parsedData?.skills || [],
      experience: user?.resume?.parsedData?.experience || [],
      summary: user?.resume?.parsedData?.summary || 'Experienced professional'
    }

    const prompt = `You are an expert interview preparation assistant. Generate personalized interview questions based on the following:

Job Title: ${jobTitle || 'Not specified'}
Job Description: ${jobDescription || 'Not specified'}

User Profile:
- Skills: ${userProfile.skills.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience.join(', ') || 'Not specified'}
- Summary: ${userProfile.summary}

Generate exactly 10 questions in each category:

1. Technical Questions: Focus on technical skills, programming, tools, and technologies
2. Behavioral Questions: Focus on teamwork, problem-solving, leadership, and work scenarios
3. Domain-Specific Questions: Focus on industry-specific knowledge and role requirements

For each question, provide:
- q: The interview question (string)
- a: An ideal sample answer tailored to the user's profile (string, 2-3 sentences)
- tips: An array of 3-4 personalized improvement tips (array of strings)

Return the response as a valid JSON object with this structure:
{
  "technical": [
    {
      "q": "Question text",
      "a": "Ideal answer text",
      "tips": ["Tip 1", "Tip 2", "Tip 3"]
    }
  ],
  "behavioral": [...],
  "domain": [...]
}`

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY
    const useGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

    let result
    if (useGemini) {
      result = await callGemini(prompt)
    } else {
      result = await callOpenAI(prompt, 'You are an expert interview preparation assistant. Return only valid JSON.')
    }

    // Parse and validate JSON response
    let parsedResult
    try {
      parsedResult = typeof result === 'string' ? JSON.parse(result) : result
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid response format from AI')
      }
    }

    // Validate structure
    if (!parsedResult.technical || !parsedResult.behavioral || !parsedResult.domain) {
      throw new Error('Invalid response structure')
    }

    res.json(parsedResult)
  } catch (error) {
    console.error('Interview generation error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to generate interview questions',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// AI Answer Analysis (for voice mode)
AIRoutes.post('/analyze-answer', requireAuth, async (req, res) => {
  try {
    const { question, idealAnswer, userAnswer, tips } = req.body

    if (!question || !userAnswer) {
      return res.status(400).json({ error: 'Question and user answer are required' })
    }

    const prompt = `Analyze the user's interview answer and provide feedback:

Question: ${question}
Ideal Answer: ${idealAnswer || 'Not provided'}
User's Answer: ${userAnswer}
Reference Tips: ${tips?.join(', ') || 'None'}

Provide a JSON response with:
{
  "score": <number 0-100>,
  "feedback": "<2-3 sentence feedback on content, relevance, and clarity>",
  "suggestions": ["<specific suggestion 1>", "<specific suggestion 2>", "<specific suggestion 3>"],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement area 1>", "<improvement area 2>"]
}`

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY
    const useGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

    let result
    if (useGemini) {
      result = await callGemini(prompt)
    } else {
      result = await callOpenAI(prompt, 'You are an expert interview coach. Return only valid JSON.')
    }

    let parsedResult
    try {
      parsedResult = typeof result === 'string' ? JSON.parse(result) : result
    } catch (parseError) {
      const jsonMatch = result.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0])
      } else {
        // Fallback response
        parsedResult = {
          score: 70,
          feedback: "Your answer shows understanding, but could be more structured and specific.",
          suggestions: ["Add specific examples", "Include quantifiable achievements", "Demonstrate clear thinking process"],
          strengths: ["Good general understanding"],
          improvements: ["More structure needed", "Add concrete examples"]
        }
      }
    }

    res.json(parsedResult)
  } catch (error) {
    console.error('Answer analysis error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to analyze answer',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// AI Career Chat
AIRoutes.post('/career-chat', requireAuth, async (req, res) => {
  try {
    const { message, threadId } = req.body
    const userId = req.user.id || req.user._id

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Get user profile for context
    const User = (await import('../model/user.model.js')).default
    const mongoose = await import('mongoose')
    let user = null
    try {
      user = await User.findById(new mongoose.default.Types.ObjectId(userId)).lean()
    } catch (err) {
      console.warn('User not found for career chat:', userId)
    }

    // Get chat history if threadId exists
    const ChatMessage = (await import('../model/chat.model.js')).default
    let history = []
    if (threadId) {
      try {
        history = await ChatMessage.find({ userId: new mongoose.default.Types.ObjectId(userId), threadId })
          .sort({ createdAt: 1 })
          .limit(30)
          .lean()
      } catch (err) {
        console.warn('Failed to load chat history:', err)
      }
    }

    const userProfile = {
      skills: user?.resume?.parsedData?.skills || user?.skills || [],
      experience: user?.resume?.parsedData?.experience || [],
      summary: user?.resume?.parsedData?.summary || user?.bio || 'Experienced professional'
    }

    const contextPrompt = `
You are an AI Career Assistant helping users with their career development.

User Profile:
- Skills: ${userProfile.skills.join(', ') || 'Not specified'}
- Experience: ${userProfile.experience.join(', ') || 'Not specified'}
- Summary: ${userProfile.summary}

${history.length > 0 ? `Previous conversation:\n${history.map(h => `${h.role}: ${h.content}`).join('\n')}\n` : ''}

User Question: ${message}

Provide helpful, practical career advice. Be concise, specific, and actionable. If suggesting learning resources, mention specific platforms (Coursera, Udemy, etc.) when relevant.`

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY
    const useGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

    const { callGemini, callOpenAI } = await import('../utils/ai-helper.js')
    let reply
    if (useGemini) {
      reply = await callGemini(contextPrompt)
    } else {
      reply = await callOpenAI(contextPrompt, 'You are an expert career advisor. Provide practical, actionable advice.')
    }

    // Save messages to database
    const newThreadId = threadId || crypto.randomUUID()
    try {
      const ChatMessage = (await import('../model/chat.model.js')).default
      await ChatMessage.create([
        { userId: new mongoose.default.Types.ObjectId(userId), threadId: newThreadId, role: 'user', content: message, createdAt: new Date() },
        { userId: new mongoose.default.Types.ObjectId(userId), threadId: newThreadId, role: 'assistant', content: reply, createdAt: new Date() }
      ])
    } catch (err) {
      console.warn('Failed to save chat messages:', err)
    }

    res.json({ threadId: newThreadId, reply })
  } catch (error) {
    console.error('Career chat error:', error)
    res.status(500).json({ 
      error: error.message || 'Failed to get AI response',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// AI Resume Analyzer
AIRoutes.post('/analyze-resume', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id

    const User = (await import('../model/user.model.js')).default
    const mongoose = await import('mongoose')
    let user = null
    try {
      user = await User.findById(new mongoose.default.Types.ObjectId(userId)).lean()
    } catch (err) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!user?.resume?.parsedData) {
      return res.status(404).json({ error: 'No resume found. Please upload a resume first.' })
    }

    const resumeData = user.resume.parsedData
    const resumeText = `
Skills: ${resumeData.skills?.join(', ') || 'None'}
Experience: ${resumeData.experience?.join(', ') || 'None'}
Education: ${resumeData.education?.join(', ') || 'None'}
Summary: ${resumeData.summary || 'None'}
`

    const prompt = `
Analyze this resume and provide detailed feedback in JSON format:

${resumeText}

Return JSON with:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "missingSkills": ["skill1", "skill2"],
  "keywords": ["keyword1", "keyword2"],
  "score": 85,
  "formatting": "feedback on formatting",
  "contentQuality": "feedback on content"
}`

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY
    const useGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

    const { callGemini, callOpenAI } = await import('../utils/ai-helper.js')
    let result
    if (useGemini) {
      result = await callGemini(prompt)
    } else {
      result = await callOpenAI(prompt, 'You are a professional resume analyzer. Return only valid JSON.')
    }

    let parsedResult
    try {
      parsedResult = typeof result === 'string' ? JSON.parse(result) : result
    } catch (parseError) {
      // Fallback analysis
      parsedResult = {
        strengths: resumeData.skills?.length > 0 ? ['Good technical skills listed'] : [],
        weaknesses: ['Limited detail provided'],
        suggestions: ['Add more specific achievements', 'Quantify your impact'],
        missingSkills: ['Leadership', 'Communication'],
        keywords: resumeData.skills || [],
        score: Math.min((resumeData.skills?.length || 0) * 10, 100),
        formatting: 'Ensure consistent formatting',
        contentQuality: 'Basic content quality'
      }
    }

    res.json({ analysis: parsedResult })
  } catch (error) {
    console.error('Resume analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze resume' })
  }
})

// AI Cover Letter Generator
AIRoutes.post('/cover-letter', requireAuth, async (req, res) => {
  try {
    const { jobId, jobTitle, jobDescription } = req.body
    const userId = req.user.id || req.user._id

    if (!jobId && !jobTitle && !jobDescription) {
      return res.status(400).json({ error: 'Job information is required' })
    }

    const User = (await import('../model/user.model.js')).default
    const mongoose = await import('mongoose')
    let user = null
    let job = null

    try {
      user = await User.findById(new mongoose.default.Types.ObjectId(userId)).lean()
    } catch (err) {
      console.warn('User not found:', userId)
    }

    if (jobId) {
      const Job = (await import('../model/job.model.js')).default
      try {
        job = await Job.findById(new mongoose.default.Types.ObjectId(jobId)).lean()
      } catch (err) {
        console.warn('Job not found:', jobId)
      }
    }

    const jobInfo = job ? {
      title: job.title,
      company: job.company,
      description: job.description || '',
      skills: job.skills || [],
      requirements: job.requirements || []
    } : {
      title: jobTitle || 'Position',
      company: 'Company',
      description: jobDescription || '',
      skills: [],
      requirements: []
    }

    const userProfile = {
      name: user?.name || 'Candidate',
      skills: user?.resume?.parsedData?.skills || user?.skills || [],
      experience: user?.resume?.parsedData?.experience || [],
      summary: user?.resume?.parsedData?.summary || user?.bio || 'Experienced professional'
    }

    const prompt = `
Generate a professional cover letter for this job application:

Job Details:
- Title: ${jobInfo.title}
- Company: ${jobInfo.company}
- Description: ${jobInfo.description}
- Required Skills: ${jobInfo.skills.join(', ') || 'Not specified'}
- Requirements: ${jobInfo.requirements.join(', ') || 'Not specified'}

Applicant Profile:
- Name: ${userProfile.name}
- Skills: ${userProfile.skills.join(', ')}
- Experience: ${userProfile.experience.join(', ')}
- Summary: ${userProfile.summary}

Generate a professional, personalized cover letter (300-400 words) that:
1. Addresses the hiring manager professionally
2. Highlights relevant skills and experience
3. Explains interest in the position
4. Demonstrates alignment with job requirements
5. Includes a professional closing

Return only the cover letter text, no additional formatting.`

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.OPENAI_API_KEY
    const useGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY

    const { callGemini, callOpenAI } = await import('../utils/ai-helper.js')
    let coverLetter
    if (useGemini) {
      coverLetter = await callGemini(prompt)
    } else {
      coverLetter = await callOpenAI(prompt, 'You are a professional career advisor. Generate compelling, personalized cover letters.')
    }

    res.json({ coverLetter: coverLetter.trim() })
  } catch (error) {
    console.error('Cover letter generation error:', error)
    res.status(500).json({ error: 'Failed to generate cover letter' })
  }
})

// AI Job Recommendations (update existing)
AIRoutes.get('/recommendations', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const { getJobRecommendations } = await import('../controller/ai.controller.js')
    
    // Create a mock req/res object for the controller
    const mockReq = {
      headers: { authorization: req.headers.authorization },
      user: req.user
    }
    const mockRes = {
      json: (data) => res.json(data),
      status: (code) => ({ json: (data) => res.status(code).json(data) })
    }

    await getJobRecommendations(mockReq, mockRes)
  } catch (error) {
    console.error('Recommendations error:', error)
    res.status(500).json({ error: 'Failed to get recommendations' })
  }
})

export default AIRoutes
