import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

const initial = {
  title:'', company:'', location:'', type:'Full-time', salary:'',
  description:'', requirements:'',
}

export default function JobForm(){
  const { id } = useParams()
  const isEdit = Boolean(id)
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = getToken()

  useEffect(()=>{
    const load = async ()=>{
      if(!isEdit) return
      try{
        const res = await fetch(`/api/jobs/${id}`)
        if(!res.ok) throw new Error('Failed to load job')
        const data = await res.json()
        const j = data.job
        setForm({
          title: j.title || '',
          company: j.company || '',
          location: j.location || '',
          type: j.type || 'Full-time',
          salary: j.salary || '',
          description: j.description || '',
          requirements: (j.requirements || []).join('\n')
        })
      }catch(e){ setError(e.message) }
    }
    load()
  }, [id])

  const onChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    // basic validation
    if(!form.title || !form.company){ setError('Title and Company are required'); return }
    setLoading(true)
    try{
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location,
        type: form.type,
        salary: form.salary,
        description: form.description,
        requirements: form.requirements.split('\n').map(s=>s.trim()).filter(Boolean)
      }
      const res = await fetch(isEdit ? `/api/jobs/${id}` : '/api/jobs', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if(!res.ok) throw new Error('Failed to save job')
      navigate('/admin/jobs')
    }catch(e){ setError(e.message) }
    finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <h1 className="text-2xl font-bold mb-4">{isEdit ? 'Edit Job' : 'Add New Job'}</h1>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="bg-white rounded shadow p-4 space-y-4">
          <div>
            <label className="block text-sm mb-1">Job Title</label>
            <input name="title" value={form.title} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input name="company" value={form.company} onChange={onChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">Location</label>
              <input name="location" value={form.location} onChange={onChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Job Type</label>
              <select name="type" value={form.type} onChange={onChange} className="w-full border rounded px-3 py-2">
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Remote</option>
                <option>Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Salary</label>
              <input name="salary" value={form.salary} onChange={onChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={onChange} className="w-full border rounded px-3 py-2 h-28" />
          </div>
          <div>
            <label className="block text-sm mb-1">Requirements (one per line)</label>
            <textarea name="requirements" value={form.requirements} onChange={onChange} className="w-full border rounded px-3 py-2 h-32" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={()=>navigate('/admin/jobs')} className="px-3 py-2 rounded border">Cancel</button>
            <button disabled={loading} className="px-3 py-2 rounded bg-gray-900 text-white">{loading? 'Saving...' : 'Save Job'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}


