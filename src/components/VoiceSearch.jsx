import React, { useState, useEffect } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { Button } from './ui/button'
import { motion } from 'framer-motion'
import { useToast } from './ui/toast'

export default function VoiceSearch({ onSearch }) {
  const [listening, setListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const { error, info } = useToast()

  useEffect(() => {
    // Check if browser supports Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = 'en-US'

      recognitionInstance.onstart = () => {
        setListening(true)
        info('Listening... Speak now')
      }

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        onSearch(transcript)
        setListening(false)
      }

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        error('Speech recognition failed. Please try again.')
        setListening(false)
      }

      recognitionInstance.onend = () => {
        setListening(false)
      }

      setRecognition(recognitionInstance)
    } else {
      console.warn('Speech recognition not supported in this browser')
    }

    return () => {
      // Cleanup handled by component unmount
    }
  }, [])

  const toggleListening = () => {
    if (!recognition) {
      error('Speech recognition is not supported in your browser')
      return
    }

    if (listening) {
      recognition.stop()
      setListening(false)
    } else {
      try {
        recognition.start()
      } catch (err) {
        console.error('Failed to start recognition:', err)
        error('Failed to start voice search')
      }
    }
  }

  if (!recognition) {
    return null // Don't show button if not supported
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleListening}
      className={listening ? 'animate-pulse' : ''}
    >
      {listening ? (
        <>
          <MicOff className="h-4 w-4 mr-2" />
          Stop Listening
        </>
      ) : (
        <>
          <Mic className="h-4 w-4 mr-2" />
          Voice Search
        </>
      )}
    </Button>
  )
}

