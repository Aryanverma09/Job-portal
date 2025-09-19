import React from 'react'
import { useNavigate } from 'react-router-dom'

const companies = [
  { id: 'a', name: 'Acme Inc', industry: 'Software', location: 'Remote' },
  { id: 'b', name: 'Globex', industry: 'Fintech', location: 'NYC' },
  { id: 'c', name: 'Initech', industry: 'Design', location: 'San Francisco' },
]

export default function Companies(){
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Companies</h1>
        <div className="grid grid-cols-1 gap-4">
          {companies.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{c.name}</h2>
                <p className="text-sm text-gray-500">{c.industry} • {c.location}</p>
              </div>
              <div>
                <button onClick={() => navigate(`/companies/${c.id}`)} className="px-4 py-2 bg-indigo-600 text-white rounded">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
