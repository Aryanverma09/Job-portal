import React from 'react'
import RegisterForm from './pages/Register'
import LoginForm from './pages/Login'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom' // ✅ ADDED: useLocation for animations
import LandingPage from './pages/LandingPage'
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
import { AnimatePresence, motion } from 'framer-motion' // ✅ ADDED: Framer Motion for page transitions

const App = () => {
  const location = useLocation() // ✅ Track current route for animations
  
  const AdminGuard = ({ children }) => {
    return hasAnyRole(['admin','super_admin','employer_admin','moderator']) ? children : <Navigate to="/" />
  }

  // ✅ Page transition variants - smooth fade and slide
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }
  }

  return (
    // ✅ AnimatePresence enables exit animations when components unmount
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ✅ Each route wrapped in motion.div for smooth transitions */}
        <Route path="/" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LandingPage/>
          </motion.div>
        } />
        
        <Route path="/login" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <LoginForm/>
          </motion.div>
        } />
        
        <Route path="/register" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <RegisterForm/>
          </motion.div>
        } />
        
        <Route path="/main" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <MainPage/>
          </motion.div>
        } />
        
        <Route path="/jobs" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Jobs/>
          </motion.div>
        } />
        
        <Route path="/jobs/:id" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <JobDetail/>
          </motion.div>
        } />
        
        <Route path="/companies" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Companies/>
          </motion.div>
        } />
        
        <Route path="/companies/:id" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <CompanyDetail/>
          </motion.div>
        } />
        
        <Route path="/profile" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Profile/>
          </motion.div>
        } />
        
        <Route path="/admin" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminGuard><AdminDashboard/></AdminGuard>
          </motion.div>
        } />
        
        <Route path="/admin/users" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminGuard><AdminUsers/></AdminGuard>
          </motion.div>
        } />
        
        <Route path="/admin/jobs" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminGuard><AdminJobs/></AdminGuard>
          </motion.div>
        } />
        
        <Route path="/admin/jobs/new" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminGuard><JobForm/></AdminGuard>
          </motion.div>
        } />
        
        <Route path="/admin/jobs/:id" element={
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <AdminGuard><JobForm/></AdminGuard>
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default App
