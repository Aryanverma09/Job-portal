import React from 'react'
import { useNavigate } from 'react-router-dom'

const jobsData = [
  { id: '1', title: 'Frontend Engineer', company: 'Acme Inc', location: 'Remote', salary: '$90k - $120k' },
  { id: '2', title: 'Backend Engineer', company: 'Globex', location: 'NYC', salary: '$100k - $140k' },
  { id: '3', title: 'Product Designer', company: 'Initech', location: 'San Francisco', salary: '$110k - $150k' },
]

export default function Jobs() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Jobs</h1>
        <div className="grid grid-cols-1 gap-4">
          {jobsData.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{job.title}</h2>
                <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                <p className="text-sm text-gray-600 mt-1">{job.salary}</p>
              </div>
              <div>
                <button onClick={() => navigate(`/jobs/${job.id}`)} className="px-4 py-2 bg-indigo-600 text-white rounded">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
