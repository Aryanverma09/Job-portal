import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const jobsData = {
  '1': { id: '1', title: 'Frontend Engineer', company: 'Acme Inc', location: 'Remote', salary: '$90k - $120k', description: 'Build beautiful and accessible web interfaces using React and Tailwind.' },
  '2': { id: '2', title: 'Backend Engineer', company: 'Globex', location: 'NYC', salary: '$100k - $140k', description: 'Work on scalable services and APIs using Node.js and databases.' },
  '3': { id: '3', title: 'Product Designer', company: 'Initech', location: 'San Francisco', salary: '$110k - $150k', description: 'Design delightful user experiences and prototypes.' },
}

export default function JobDetail(){
  const { id } = useParams()
  const navigate = useNavigate()
  const job = jobsData[id]

  if(!job) return (
    <div className="min-h-screen flex items-center justify-center">Job not found</div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-8">
        <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 mb-4">← Back</button>
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
          <p className="mt-4 text-gray-700">{job.description}</p>
          <p className="mt-4 font-medium">Salary: {job.salary}</p>
          <div className="mt-6">
            <button className="px-4 py-2 bg-green-600 text-white rounded">Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}
