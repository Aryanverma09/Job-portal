import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, Bot, User, Sparkles, Plus, Save, History } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { useToast } from './ui/toast'

/**
 * Props
 * - userContext: optional object including { skills: string[], resume?: any, appliedJobs?: any[] }
 */
const AICareerAssistant = ({ userContext }) => {
  const { error, success } = useToast()

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m your AI Career Assistant. Ask me about jobs, skill growth, or career transitions.' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [threadId, setThreadId] = useState(null)
  const chatRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, sending])

  const placeholder = useMemo(() => (
    'Ask anything: “Suggest jobs matching my skills”, “How do I switch to backend?”, “What should I learn next?”'
  ), [])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')

    try {
      const token = localStorage.getItem('token')
      const headers = token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }

      // Include optional userContext as an initial priming message
      const body = {
        message: userContext ? `${text}\n\n[UserContext]: ${JSON.stringify(userContext)}` : text,
        threadId: threadId || undefined
      }

      const res = await fetch('/api/ai/career-chat', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      if (!res.ok) {
        const data = await res.json().catch(()=>({}))
        throw new Error(data?.error || 'Failed to get response')
      }

      const data = await res.json()
      if (data.threadId && !threadId) setThreadId(data.threadId)
      const reply = data.reply || 'Sorry, I could not generate a response right now.'

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      console.error(e)
      error(e.message || 'Something went wrong')
      setMessages(prev => [...prev, { role: 'assistant', content: 'I ran into an error responding. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  const startNewChat = () => {
    setThreadId(null)
    setMessages([{ role: 'assistant', content: 'New chat started. How can I help with your career today?' }])
  }

  const saveConversation = () => {
    try {
      const blob = new Blob([JSON.stringify({ threadId, messages, savedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `career-chat-${threadId || 'session'}.json`
      a.click()
      URL.revokeObjectURL(url)
      success('Conversation exported to a file')
    } catch (e) {
      error('Failed to save conversation')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="h-7 w-7 text-blue-600" />
          <h1 className="text-2xl font-bold">AI Career Assistant</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={startNewChat}>
            <Plus className="h-4 w-4 mr-1" /> New Chat
          </Button>
          <Button variant="outline" size="sm" onClick={saveConversation} disabled={!messages?.length}>
            <Save className="h-4 w-4 mr-1" /> Save
          </Button>
        </div>
      </motion.div>

      {/* Context hint */}
      {userContext && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground flex items-center gap-2">
          <History className="h-3.5 w-3.5" />
          Using your context: skills ({(userContext.skills || []).slice(0,6).join(', ') || 'n/a'}){userContext.appliedJobs?`, applied jobs: ${userContext.appliedJobs.length}`:''}
        </motion.div>
      )}

      {/* Chat window */}
      <Card className="border-2">
        <CardContent className="p-0">
          <div ref={chatRef} className="h-[55vh] overflow-y-auto p-4 space-y-3 bg-white/50 dark:bg-neutral-900/40">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm border ${
                  m.role === 'user'
                    ? 'ml-auto bg-blue-600 text-white border-blue-600'
                    : 'bg-background border-border'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-80">
                  {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                  <span className="text-[11px]">{m.role === 'user' ? 'You' : 'Assistant'}</span>
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <AnimatePresence>
              {sending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="inline-flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Assistant is typing…
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input bar */}
          <div className="border-t p-3 flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder={placeholder}
            />
            <Button onClick={sendMessage} disabled={sending || !input.trim()} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick suggestions */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2">
        {[
          'Suggest jobs that fit my resume',
          'How can I become a backend developer?',
          'What skills should I learn next?',
          'Show trending skills for React developers'
        ].map((q) => (
          <Badge key={q} variant="outline" className="cursor-pointer" onClick={() => setInput(q)}>
            {q}
          </Badge>
        ))}
      </motion.div>
    </div>
  )
}

export default AICareerAssistant
