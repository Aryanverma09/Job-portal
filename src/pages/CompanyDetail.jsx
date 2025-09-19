import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const companies = {
  'a': { id: 'a', name: 'Acme Inc', industry: 'Software', location: 'Remote', about: 'We build tools to help teams ship faster.' },
  'b': { id: 'b', name: 'Globex', industry: 'Fintech', location: 'NYC', about: 'Fintech company focused on payments.' },
  'c': { id: 'c', name: 'Initech', industry: 'Design', location: 'San Francisco', about: 'Design-driven product studio.' },
}

export default function CompanyDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const company = companies[id]

  if(!company) return (
    <div className="min-h-screen flex items-center justify-center">Company not found</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-8">
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 mb-4">← Back</button>
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-gray-500">{company.industry} • {company.location}</p>
          <p className="mt-4 text-gray-700">{company.about}</p>
        </div>
      </div>
    </div>
  )
}
