import React from 'react'
import Navbar from '../components/Navbar'
import AIInterviewAssistant from '../components/AIInterviewAssistant'

export default function InterviewPreparation() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <AIInterviewAssistant />
      </div>
    </div>
  )
}

