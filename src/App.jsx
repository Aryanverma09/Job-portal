import React from 'react'
import RegisterForm from './pages/Register'
import LoginForm from './pages/Login'
import { Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Profile from './pages/Profile'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm/>} />
      <Route path="/register" element={<RegisterForm/>} />
      <Route path="/main" element={<MainPage/>} />
      <Route path="/jobs" element={<Jobs/>} />
      <Route path="/jobs/:id" element={<JobDetail/>} />
      <Route path="/companies" element={<Companies/>} />
      <Route path="/companies/:id" element={<CompanyDetail/>} />
      <Route path="/profile" element={<Profile/>} />
    </Routes>
  )
}

export default App
