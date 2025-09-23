import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import User from '../model/user.model.js'
import AuditLog from '../model/auditLog.model.js'

const MetricsRoutes = express.Router()
MetricsRoutes.use(requireAuth, requireAdmin)

MetricsRoutes.get('/overview', async (req, res) => {
  // Minimal overview based on existing models (users and audit as placeholders)
  const totalUsers = await User.countDocuments()
  const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } })
  const recentAdminActions = await AuditLog.find({}).sort({ _id: -1 }).limit(5).lean()
  res.json({
    totals: { users: totalUsers, jobs: 0, employers: 0, candidates: 0, activeJobs: 0, expiredJobs: 0 },
    thisWeek: { newUsers: newUsersThisWeek, jobsPosted: 0, applications: 0 },
    recentAdminActions
  })
})

MetricsRoutes.get('/charts', async (req, res) => {
  // Return stub series data; can be replaced when jobs/applications collections are added
  const now = new Date()
  const days = [...Array(7)].map((_, i) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i)))
  const userGrowth = days.map((d, i) => ({ date: d.toISOString().slice(0,10), count: Math.max(0, i*3 - 2) }))
  const jobsByCategory = [
    { category: 'Engineering', count: 12 },
    { category: 'Design', count: 5 },
    { category: 'Marketing', count: 4 }
  ]
  const applicationTrends = days.map((d, i) => ({ date: d.toISOString().slice(0,10), count: Math.max(0, i*2 - 1) }))
  res.json({ userGrowth, jobsByCategory, applicationTrends })
})

export default MetricsRoutes



