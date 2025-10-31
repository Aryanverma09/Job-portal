import { GoogleGenerativeAI } from '@google/generative-ai'
import OpenAI from 'openai'

// Initialize Gemini
let geminiClient = null
if (process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
  } catch (error) {
    console.error('Failed to initialize Gemini:', error)
  }
}

// Initialize OpenAI
let openaiClient = null
if (process.env.OPENAI_API_KEY) {
  try {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  } catch (error) {
    console.error('Failed to initialize OpenAI:', error)
  }
}

/**
 * Call Gemini API
 */
export const callGemini = async (prompt, systemInstruction = null) => {
  if (!geminiClient) {
    throw new Error('Gemini API key not configured')
  }

  try {
    const model = geminiClient.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro'
    })

    const generationConfig = {
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 4096,
    }

    let chat
    if (systemInstruction) {
      chat = model.startChat({
        generationConfig,
        systemInstruction,
        history: []
      })
    } else {
      chat = model.startChat({
        generationConfig,
        history: []
      })
    }

    const result = await chat.sendMessage(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Gemini API error:', error)
    throw new Error(`Gemini API error: ${error.message}`)
  }
}

/**
 * Call OpenAI API
 */
export const callOpenAI = async (prompt, systemMessage = null) => {
  if (!openaiClient) {
    throw new Error('OpenAI API key not configured')
  }

  try {
    const messages = []
    
    if (systemMessage) {
      messages.push({
        role: 'system',
        content: systemMessage
      })
    }

    messages.push({
      role: 'user',
      content: prompt
    })

    const completion = await openaiClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 4096
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error(`OpenAI API error: ${error.message}`)
  }
}

/**
 * Check if AI service is available
 */
export const isAIAvailable = () => {
  return !!(geminiClient || openaiClient)
}

