import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

export default function AdminJobs(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [jobs, setJobs] = useState([])
  const navigate = useNavigate()
  const token = getToken()

  const loadJobs = async () => {
    try{
      setLoading(true)
      setError('')
      const res = await fetch('/api/jobs')
      if(!res.ok) throw new Error('Failed to load jobs')
      const data = await res.json()
      setJobs(data.jobs || [])
    }catch(e){ setError(e.message) }
    finally{ setLoading(false) }
  }

  useEffect(()=>{ loadJobs() }, [])

  const onDelete = async (job) => {
    if(!confirm('Delete this job?')) return
    try{
      const res = await fetch(`/api/jobs/${job.id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } })
      if(!res.ok) throw new Error('Failed to delete job')
      await loadJobs()
    }catch(e){ setError(e.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Jobs</h1>
          <Link to="/admin/jobs/new" className="px-3 py-2 bg-gray-900 text-white rounded">Add New Job</Link>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Job Title</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Posted</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(j => (
                <tr key={j.id} className="border-t">
                  <td className="px-4 py-2">{j.title}</td>
                  <td className="px-4 py-2">{j.company}</td>
                  <td className="px-4 py-2">{j.location}</td>
                  <td className="px-4 py-2">{j.type}</td>
                  <td className="px-4 py-2">{j.posted}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={()=> navigate(`/admin/jobs/${j.id}`)} className="px-2 py-1 bg-blue-600 text-white rounded">Edit</button>
                    <button onClick={()=> onDelete(j)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {!loading && jobs.length === 0 && (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={6}>No jobs found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


