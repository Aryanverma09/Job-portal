import React from 'react'

export default function About(){
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">About HireUp</h1>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-gray-700">HireUp is a simple job board demo built for learning and prototyping. Browse jobs, explore companies, and apply for roles. This demo uses a mock dataset on the client — hook up a real backend to make it production-ready.</p>
        </div>
      </div>
    </div>
  )
}
