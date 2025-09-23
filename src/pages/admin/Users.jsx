import React, { useEffect, useMemo, useState } from 'react'
import AdminNavbar from '../../components/AdminNavbar'
import { getToken } from '../../utils/auth'

export default function AdminUsers(){
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')

  const token = getToken()

  const loadUsers = async () => {
    try{
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if(query) params.set('q', query)
      if(role) params.set('role', role)
      if(status) params.set('status', status)
      const res = await fetch(`/api/admin/users?${params.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      if(!res.ok) throw new Error('Failed to load users')
      const data = await res.json()
      setUsers(data.users || [])
    }catch(e){
      setError(e.message || 'Failed to load users')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{ loadUsers() }, [])

  const onToggleStatus = async (user) => {
    try{
      const res = await fetch(`/api/admin/users/${user._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !user.isActive })
      })
      if(!res.ok) throw new Error('Failed to update status')
      await loadUsers()
    }catch(e){ setError(e.message) }
  }

  const onDelete = async (user) => {
    if(!confirm('Delete this user?')) return
    try{
      const res = await fetch(`/api/admin/users/${user._id}`, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } })
      if(!res.ok) throw new Error('Failed to delete user')
      await loadUsers()
    }catch(e){ setError(e.message) }
  }

  const onChangeRole = async (user, newRole) => {
    try{
      const res = await fetch(`/api/admin/users/${user._id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole })
      })
      if(!res.ok) throw new Error('Failed to update role')
      await loadUsers()
    }catch(e){ setError(e.message) }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>

        <div className="bg-white rounded shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name/email" className="border rounded px-3 py-2" />
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="border rounded px-3 py-2">
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select value={status} onChange={(e)=>setStatus(e.target.value)} className="border rounded px-3 py-2">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <button onClick={loadUsers} className="px-3 py-2 bg-gray-900 text-white rounded w-full">Search</button>
            </div>
          </div>
        </div>

        {loading && <p className="text-gray-600">Loading...</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=> (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <select value={u.role} onChange={(e)=>onChangeRole(u, e.target.value)} className="border rounded px-2 py-1">
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button onClick={()=>onToggleStatus(u)} className={`px-2 py-1 rounded ${u.isActive ? 'bg-yellow-500 text-white' : 'bg-green-600 text-white'}`}>{u.isActive ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={()=>onDelete(u)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {!loading && users.length === 0 && (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


