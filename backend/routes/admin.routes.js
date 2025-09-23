import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { audit } from '../middleware/audit.js'
import User from '../model/user.model.js'

const AdminRoutes = express.Router()

// All routes below require admin access
AdminRoutes.use(requireAuth, requireAdmin)

// List users with basic filtering (q, role, status)
AdminRoutes.get('/users', audit('admin.users.list'), async (req, res) => {
  try {
    const { q = '', role, status } = req.query || {}
    const filter = {}
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }
    if (role) filter.role = role
    if (typeof status !== 'undefined') filter.isActive = status === 'active'
    const users = await User.find(filter, { password: 0 }).lean()
    res.json({ users })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Update a user's role
AdminRoutes.patch('/users/:id/role', audit('admin.users.updateRole', (req)=>({ type:'user', id:req.params.id }), (req)=>({ role:req.body?.role })), async (req, res) => {
  try {
    const { role } = req.body || {}
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, projection: { password: 0 } }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Delete a user
AdminRoutes.delete('/users/:id', audit('admin.users.delete', (req)=>({ type:'user', id:req.params.id })), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ message: 'User deleted' })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Activate / Deactivate a user
AdminRoutes.patch('/users/:id/status', audit('admin.users.status', (req)=>({ type:'user', id:req.params.id }), (req)=>({ isActive:req.body?.isActive })), async (req, res) => {
  try {
    const { isActive } = req.body || {}
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be boolean' })
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, projection: { password: 0 } }
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (e) {
    res.status(500).json({ message: 'Server error' })
  }
})

export default AdminRoutes

