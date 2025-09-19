import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const MainPage = () => {
  const navigate = useNavigate()
  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome{user ? `, ${user.name}` : ''}</h1>
          {user ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          ) : (
            <p className="text-gray-600">No user data available. Please login.</p>
          )}

          <div className="mt-6">
            <button onClick={logout} className="px-4 py-2 bg-red-500 text-white rounded">Logout</button>
          </div>
        </div>
      </main>
      {/* <Footer/> */}
    </div>
  )
}

export default MainPage
