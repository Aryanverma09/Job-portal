import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminNavbar(){
  const navigate = useNavigate()
  return (
    <div className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/admin" className="font-semibold">Admin Panel</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/jobs">Jobs</Link>
          <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/') }} className="px-2 py-1 bg-red-600 rounded">Logout</button>
        </div>
      </div>
    </div>
  )
}



