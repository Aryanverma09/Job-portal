import express from 'express'
import Notification from '../model/notification.model.js'
import { requireAuth } from '../middleware/auth.js'
import jwt from 'jsonwebtoken'

const NotificationRoutes = express.Router()

// Get user's notifications
NotificationRoutes.get('/', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id

    const notifications = await Notification.find({ user: userId })
      .populate('relatedJob', 'title company')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const formatted = notifications.map(notif => ({
      id: notif._id,
      type: notif.type,
      title: notif.title,
      message: notif.message,
      read: notif.read,
      createdAt: notif.createdAt,
      readAt: notif.readAt,
      relatedJob: notif.relatedJob ? {
        id: notif.relatedJob._id,
        title: notif.relatedJob.title,
        company: notif.relatedJob.company
      } : null
    }))

    const unreadCount = notifications.filter(n => !n.read).length

    res.json({
      notifications: formatted,
      unreadCount
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark notification as read
NotificationRoutes.put('/:notificationId/read', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id
    const { notificationId } = req.params

    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    })

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    notification.read = true
    notification.readAt = new Date()
    await notification.save()

    res.json({
      message: 'Notification marked as read',
      notification: {
        id: notification._id,
        read: notification.read
      }
    })
  } catch (error) {
    console.error('Mark notification read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Mark all notifications as read
NotificationRoutes.put('/read-all', requireAuth, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id

    await Notification.updateMany(
      { user: userId, read: false },
      { read: true, readAt: new Date() }
    )

    res.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all notifications read error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default NotificationRoutes

