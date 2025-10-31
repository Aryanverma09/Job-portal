import express from 'express'
import { requireAuth } from '../middleware/auth.js'
import Application from '../model/application.model.js'
import Job from '../model/job.model.js'
import User from '../model/user.model.js'
import Notification from '../model/notification.model.js'
import mongoose from 'mongoose'

const DashboardRoutes = express.Router()

// Job Seeker Dashboard - Get all stats and data
DashboardRoutes.get('/jobseeker', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const userIdObj = new mongoose.Types.ObjectId(userId)

    // Get applications with job details
    const applications = await Application.find({ applicant: userIdObj })
      .populate('job', 'title company location salary type skills description')
      .sort({ createdAt: -1 })
      .lean()

    // Calculate stats
    const stats = {
      total: applications.length,
      pending: applications.filter(app => app.status === 'Applied').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    }

    // Get notifications
    const notifications = await Notification.find({ user: userIdObj })
      .populate('relatedJob', 'title company')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const unreadCount = notifications.filter(n => !n.read).length

    // Get user profile for recommendations context
    const user = await User.findById(userIdObj).lean()

    res.json({
      stats,
      applications: applications.map(app => ({
        id: app._id.toString(),
        job: app.job ? {
          id: app.job._id.toString(),
          title: app.job.title,
          company: app.job.company,
          location: app.job.location,
          salary: app.job.salary,
          type: app.job.type,
          skills: app.job.skills
        } : null,
        status: app.status,
        appliedAt: app.appliedAt,
        reviewedAt: app.reviewedAt
      })),
      notifications: notifications.map(notif => ({
        id: notif._id.toString(),
        type: notif.type,
        title: notif.title,
        message: notif.message,
        read: notif.read,
        createdAt: notif.createdAt,
        relatedJob: notif.relatedJob ? {
          id: notif.relatedJob._id.toString(),
          title: notif.relatedJob.title,
          company: notif.relatedJob.company
        } : null
      })),
      unreadCount,
      userProfile: {
        skills: user?.resume?.parsedData?.skills || [],
        experience: user?.resume?.parsedData?.experience || [],
        summary: user?.resume?.parsedData?.summary || ''
      }
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ error: 'Failed to load dashboard data' })
  }
})

// Employer Dashboard - Get all stats and data
DashboardRoutes.get('/employer', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id
    const userIdObj = new mongoose.Types.ObjectId(userId)

    // Get all jobs (for now, we'll assume user is employer/admin)
    // TODO: Filter by employer if you have an employer field
    const jobs = await Job.find({})
      .sort({ createdAt: -1 })
      .lean()

    // Get all applications for employer's jobs
    const jobIds = jobs.map(j => j._id)
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('applicant', 'name email resume')
      .populate('job', 'title company')
      .sort({ createdAt: -1 })
      .lean()

    // Calculate stats
    const stats = {
      totalJobs: jobs.length,
      totalApplications: applications.length,
      pending: applications.filter(app => app.status === 'Applied').length,
      accepted: applications.filter(app => app.status === 'Accepted').length,
      rejected: applications.filter(app => app.status === 'Rejected').length
    }

    // Group applications by job
    const applicationsByJob = {}
    applications.forEach(app => {
      const jobId = app.job?._id?.toString()
      if (jobId) {
        if (!applicationsByJob[jobId]) {
          applicationsByJob[jobId] = []
        }
        applicationsByJob[jobId].push({
          id: app._id.toString(),
          applicant: {
            id: app.applicant?._id?.toString(),
            name: app.applicant?.name,
            email: app.applicant?.email,
            resume: app.applicant?.resume
          },
          status: app.status,
          coverLetter: app.coverLetter,
          appliedAt: app.appliedAt,
          reviewedAt: app.reviewedAt,
          reviewNotes: app.reviewNotes
        })
      }
    })

    res.json({
      stats,
      jobs: jobs.map(job => ({
        id: job._id.toString(),
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        skills: job.skills,
        applicants: job.applicants || 0,
        applications: applicationsByJob[job._id.toString()] || []
      }))
    })
  } catch (error) {
    console.error('Employer dashboard error:', error)
    res.status(500).json({ error: 'Failed to load employer dashboard data' })
  }
})

export default DashboardRoutes

