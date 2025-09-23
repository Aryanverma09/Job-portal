import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

export default function AdminDashboard(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [overview, setOverview] = useState(null)
  const [charts, setCharts] = useState(null)

  useEffect(()=>{
    const load = async ()=>{
      try{
        setError('')
        setLoading(true)
        const token = getToken()
        const [ovRes, chRes] = await Promise.all([
          fetch('/api/admin/metrics/overview', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/admin/metrics/charts', { headers: { Authorization: `Bearer ${token}` } }),
        ])
        if(!ovRes.ok || !chRes.ok) throw new Error('Failed to load metrics')
        setOverview(await ovRes.json())
        setCharts(await chRes.json())
      }catch(e){
        setError(e.message || 'Failed to load')
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(overview.totals || {}).map(([k,v])=> (
              <div key={k} className="bg-white rounded shadow p-4">
                <div className="text-sm text-gray-500">{k}</div>
                <div className="text-2xl font-semibold">{v}</div>
              </div>
            ))}
          </div>
        )}
        {charts && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-4">
              <div className="font-medium mb-2">User Growth (last 7 days)</div>
              <div className="text-sm text-gray-600">{charts.userGrowth.map(p=>p.count).join(', ')}</div>
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-medium mb-2">Jobs by Category</div>
              <ul className="text-sm text-gray-600 space-y-1">
                {charts.jobsByCategory.map(c=>(<li key={c.category}>{c.category}: {c.count}</li>))}
              </ul>
            </div>
            <div className="bg-white rounded shadow p-4 lg:col-span-2">
              <div className="font-medium mb-2">Application Trends</div>
              <div className="text-sm text-gray-600">{charts.applicationTrends.map(p=>p.count).join(', ')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



