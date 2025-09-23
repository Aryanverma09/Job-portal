import React from 'react'
import RegisterForm from './pages/Register'
import LoginForm from './pages/Login'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainPage from './pages/MainPage'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Companies from './pages/Companies'
import CompanyDetail from './pages/CompanyDetail'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminJobs from './pages/admin/Jobs'
import JobForm from './pages/admin/JobForm'
import { hasAnyRole } from './utils/auth'

const App = () => {
  const AdminGuard = ({ children }) => {
    return hasAnyRole(['admin','super_admin','employer_admin','moderator']) ? children : <Navigate to="/" />
  }

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
      <Route path="/admin" element={<AdminGuard><AdminDashboard/></AdminGuard>} />
      <Route path="/admin/users" element={<AdminGuard><AdminUsers/></AdminGuard>} />
      <Route path="/admin/jobs" element={<AdminGuard><AdminJobs/></AdminGuard>} />
      <Route path="/admin/jobs/new" element={<AdminGuard><JobForm/></AdminGuard>} />
      <Route path="/admin/jobs/:id" element={<AdminGuard><JobForm/></AdminGuard>} />
    </Routes>
  )
}

export default App
