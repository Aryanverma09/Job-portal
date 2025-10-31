import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  Sparkles,
  FileText,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Play,
  Square
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { useToast } from './ui/toast'
import axios from 'axios'

const AIInterviewAssistant = () => {
  const { success, error, info } = useToast()
  
  // State management
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [currentCategory, setCurrentCategory] = useState('all')
  const [voiceMode, setVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [analysisResults, setAnalysisResults] = useState({})
  
  // Refs for voice features
  const recognitionRef = useRef(null)
  const synthesisRef = useRef(null)
  const chatEndRef = useRef(null)

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [questions, userAnswers])

  // Initialize speech recognition
  useEffect(() => {
    if (voiceMode) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          handleVoiceAnswer(transcript)
        }

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error)
          setIsListening(false)
          error('Voice recognition failed. Please try again.')
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      } else {
        error('Speech recognition is not supported in your browser')
        setVoiceMode(false)
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [voiceMode])

  // Generate interview questions
  const handleGenerate = async () => {
    if (!input.trim()) {
      error('Please enter a job title or description')
      return
    }

    setLoading(true)
    setQuestions(null)
    setUserAnswers({})
    setAnalysisResults({})

    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.post('/api/ai/interview', {
        jobTitle: input.includes('\n') ? undefined : input.trim(),
        jobDescription: input.includes('\n') ? input.trim() : undefined
      }, { headers })

      const result = response.data

      // Validate response structure
      if (!result || (!result.technical && !result.behavioral && !result.domain)) {
        throw new Error('Invalid response format from AI')
      }

      setQuestions(result)
      success('Interview questions generated successfully!')
    } catch (err) {
      console.error('Error generating questions:', err)
      error(err.response?.data?.error || 'Failed to generate interview questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle voice answer capture
  const handleVoiceAnswer = async (transcript) => {
    if (currentQuestionIndex !== null && questions) {
      const allQuestions = [
        ...(questions.technical || []),
        ...(questions.behavioral || []),
        ...(questions.domain || [])
      ]
      
      const question = allQuestions[currentQuestionIndex]
      if (question) {
        setUserAnswers(prev => ({
          ...prev,
          [currentQuestionIndex]: transcript
        }))

        // Analyze answer with AI
        analyzeAnswer(transcript, question)
      }
    }
  }

  // Analyze user's answer
  const analyzeAnswer = async (userAnswer, question) => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const response = await axios.post('/api/ai/analyze-answer', {
        question: question.q,
        idealAnswer: question.a,
        userAnswer: userAnswer,
        tips: question.tips || []
      }, { headers })

      setAnalysisResults(prev => ({
        ...prev,
        [currentQuestionIndex]: response.data
      }))

      success('Answer analyzed successfully!')
    } catch (err) {
      console.error('Error analyzing answer:', err)
      error('Failed to analyze answer')
    }
  }

  // Text-to-Speech: Read question
  const speakQuestion = (questionText, index) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentQuestionIndex(null)
      return
    }

    if (!('speechSynthesis' in window)) {
      error('Text-to-speech is not supported in your browser')
      return
    }

    const utterance = new SpeechSynthesisUtterance(questionText)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
      setCurrentQuestionIndex(index)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setCurrentQuestionIndex(null)
    }

    utterance.onerror = (err) => {
      console.error('Speech synthesis error:', err)
      setIsSpeaking(false)
      setCurrentQuestionIndex(null)
      error('Failed to read question')
    }

    window.speechSynthesis.speak(utterance)
    synthesisRef.current = utterance
  }

  // Speech-to-Text: Start listening
  const startListening = (index) => {
    if (!recognitionRef.current) {
      error('Speech recognition not available')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    setCurrentQuestionIndex(index)
    setIsListening(true)
    recognitionRef.current.start()
    info('Listening... Speak your answer now')
  }

  // Get all questions by category
  const getQuestionsByCategory = () => {
    if (!questions) return []
    
    const allQuestions = []
    const categories = ['technical', 'behavioral', 'domain']
    
    categories.forEach(category => {
      if (questions[category] && Array.isArray(questions[category])) {
        questions[category].forEach((q, idx) => {
          allQuestions.push({
            ...q,
            category,
            globalIndex: allQuestions.length,
            categoryIndex: idx + 1
          })
        })
      }
    })
    
    return currentCategory === 'all' 
      ? allQuestions 
      : allQuestions.filter(q => q.category === currentCategory)
  }

  const displayQuestions = getQuestionsByCategory()

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Interview Preparation Assistant
          </h1>
        </div>
        <p className="text-muted-foreground">
          Get personalized interview questions, answers, and feedback for any job role
        </p>
      </motion.div>

      {/* Input Section */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Enter Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter job title (e.g., Senior React Developer) or paste the full job description..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            className="resize-none"
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="voiceMode"
                checked={voiceMode}
                onChange={(e) => setVoiceMode(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="voiceMode" className="text-sm text-muted-foreground cursor-pointer">
                Enable Voice Mode (TTS/STT)
              </label>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Questions
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12 space-y-4"
          >
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            <p className="text-muted-foreground">AI is analyzing the job and generating personalized questions...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {questions && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold">Filter by Category:</span>
              {['all', 'technical', 'behavioral', 'domain'].map((cat) => (
                <Badge
                  key={cat}
                  variant={currentCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer capitalize px-4 py-2"
                  onClick={() => setCurrentCategory(cat)}
                >
                  {cat === 'all' ? 'All Questions' : cat}
                </Badge>
              ))}
            </div>

            {/* Questions Display - Chat-like UI */}
            <Card className="border-2">
              <CardContent className="p-6 space-y-6">
                {displayQuestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No questions found in this category
                  </div>
                ) : (
                  displayQuestions.map((question, index) => {
                    const globalIdx = question.globalIndex
                    const userAnswer = userAnswers[globalIdx]
                    const analysis = analysisResults[globalIdx]
                    const isCurrent = currentQuestionIndex === globalIdx

                    return (
                      <motion.div
                        key={`${question.category}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="space-y-4"
                      >
                        {/* Question Card */}
                        <div className="rounded-lg border-2 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="capitalize">
                                  {question.category}
                                </Badge>
                                <Badge variant="outline">
                                  Q{question.categoryIndex}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold">{question.q}</h3>
                            </div>
                            {voiceMode && (
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakQuestion(question.q, globalIdx)}
                                  className={isCurrent && isSpeaking ? 'bg-red-100 dark:bg-red-900/30' : ''}
                                >
                                  {isCurrent && isSpeaking ? (
                                    <>
                                      <Square className="h-4 w-4 mr-1" />
                                      Stop
                                    </>
                                  ) : (
                                    <>
                                      <Volume2 className="h-4 w-4 mr-1" />
                                      Read
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Ideal Answer */}
                          <div className="mt-4 p-3 rounded-md bg-white/70 dark:bg-neutral-900/70 border">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-semibold">Ideal Answer:</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{question.a}</p>
                          </div>

                          {/* Improvement Tips */}
                          {question.tips && question.tips.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm font-semibold">Improvement Tips:</span>
                              </div>
                              <ul className="space-y-1 ml-6">
                                {question.tips.map((tip, tipIdx) => (
                                  <li key={tipIdx} className="text-sm text-muted-foreground list-disc">
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Voice Answer Section */}
                          {voiceMode && (
                            <div className="mt-4 p-3 rounded-md bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Your Answer (Voice):</span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => startListening(globalIdx)}
                                  className={isCurrent && isListening ? 'bg-red-100 dark:bg-red-900/30' : ''}
                                >
                                  {isCurrent && isListening ? (
                                    <>
                                      <Square className="h-4 w-4 mr-1" />
                                      Stop Recording
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="h-4 w-4 mr-1" />
                                      Record Answer
                                    </>
                                  )}
                                </Button>
                              </div>
                              {userAnswer && (
                                <p className="text-sm text-muted-foreground mb-2">{userAnswer}</p>
                              )}
                              {isCurrent && isListening && (
                                <div className="flex items-center gap-2 text-red-600">
                                  <MicOff className="h-4 w-4 animate-pulse" />
                                  <span className="text-xs">Listening...</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Analysis Result */}
                          {analysis && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-3 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-semibold">AI Analysis:</span>
                              </div>
                              {analysis.score && (
                                <div className="mb-2">
                                  <span className="text-sm font-semibold">Score: </span>
                                  <Badge variant="secondary">{analysis.score}/100</Badge>
                                </div>
                              )}
                              {analysis.feedback && (
                                <p className="text-sm text-muted-foreground">{analysis.feedback}</p>
                              )}
                              {analysis.suggestions && analysis.suggestions.length > 0 && (
                                <ul className="mt-2 space-y-1 ml-4">
                                  {analysis.suggestions.map((suggestion, suggIdx) => (
                                    <li key={suggIdx} className="text-xs text-muted-foreground list-disc">
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {(questions.technical?.length || 0) + (questions.behavioral?.length || 0) + (questions.domain?.length || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Questions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{Object.keys(userAnswers).length}</div>
                      <div className="text-sm text-muted-foreground">Answers Recorded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{Object.keys(analysisResults).length}</div>
                      <div className="text-sm text-muted-foreground">Answers Analyzed</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to bottom anchor */}
      <div ref={chatEndRef} />
    </div>
  )
}

export default AIInterviewAssistant

