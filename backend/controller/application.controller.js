import Application from '../model/application.model.js'
import Job from '../model/job.model.js'
import User from '../model/user.model.js'
import Notification from '../model/notification.model.js'
import jwt from 'jsonwebtoken'
import { sendEmailNotification } from '../utils/email.js'

// Apply for a job
export const applyForJob = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id
    const { jobId, coverLetter } = req.body

    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' })
    }

    // Check if job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    })

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' })
    }

    // Get user details
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      coverLetter: coverLetter || '',
      resumePath: user.resume?.filePath || ''
    })

    // Update job applicants count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicants: 1 } })

    // Create notification for applicant
    await Notification.create({
      user: userId,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      relatedJob: jobId,
      relatedApplication: application._id
    })

    // Send email notification (if email service is configured)
    try {
      await sendEmailNotification({
        to: user.email,
        subject: `Application Submitted: ${job.title}`,
        template: 'application_submitted',
        data: {
          userName: user.name,
          jobTitle: job.title,
          companyName: job.company,
          applicationId: application._id
        }
      })
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
      // Don't fail the request if email fails
    }

    // If job has a company/employer, create notification for them
    // (This would require a job.employer field or separate employer model)
    // For now, we'll handle this in the employer dashboard

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: application._id,
        job: jobId,
        status: application.status,
        appliedAt: application.appliedAt
      }
    })
  } catch (error) {
    console.error('Apply for job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get user's applications
export const getMyApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const userId = decoded.id

    const applications = await Application.find({ applicant: userId })
      .populate('job', 'title company location salary type skills description')
      .sort({ createdAt: -1 })
      .lean()

    const formatted = applications.map(app => ({
      id: app._id,
      job: {
        id: app.job._id,
        title: app.job.title,
        company: app.job.company,
        location: app.job.location,
        salary: app.job.salary,
        type: app.job.type,
        skills: app.job.skills
      },
      status: app.status,
      appliedAt: app.appliedAt,
      reviewedAt: app.reviewedAt
    }))

    res.json({ applications: formatted })
  } catch (error) {
    console.error('Get applications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get applications for a job (for employers)
export const getJobApplications = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const { jobId } = req.params

    // Verify job exists
    const job = await Job.findById(jobId)
    if (!job) {
      return res.status(404).json({ message: 'Job not found' })
    }

    // TODO: Verify user is employer/admin for this job
    // For now, allow any authenticated user (will restrict later)

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email resume')
      .sort({ createdAt: -1 })
      .lean()

    const formatted = applications.map(app => ({
      id: app._id,
      applicant: {
        id: app.applicant._id,
        name: app.applicant.name,
        email: app.applicant.email,
        resume: app.applicant.resume
      },
      status: app.status,
      coverLetter: app.coverLetter,
      appliedAt: app.appliedAt,
      reviewedAt: app.reviewedAt,
      reviewNotes: app.reviewNotes
    }))

    res.json({ applications: formatted })
  } catch (error) {
    console.error('Get job applications error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Update application status (for employers)
export const updateApplicationStatus = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const { applicationId } = req.params
    const { status, reviewNotes } = req.body

    if (!status || !['Applied', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const application = await Application.findById(applicationId)
      .populate('job', 'title company')
      .populate('applicant', 'name email')

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    // TODO: Verify user is employer/admin for this job
    // For now, allow any authenticated admin user

    const oldStatus = application.status
    application.status = status
    application.reviewedAt = new Date()
    if (reviewNotes) {
      application.reviewNotes = reviewNotes
    }
    await application.save()

    // Create notification for applicant
    const notificationType = status === 'Accepted' ? 'application_accepted' : 'application_rejected'
    const notificationTitle = status === 'Accepted' 
      ? 'Application Accepted!' 
      : 'Application Update'
    const notificationMessage = status === 'Accepted'
      ? `Congratulations! Your application for ${application.job.title} at ${application.job.company} has been accepted.`
      : `Your application for ${application.job.title} at ${application.job.company} has been ${status.toLowerCase()}.`

    await Notification.create({
      user: application.applicant._id,
      type: notificationType,
      title: notificationTitle,
      message: notificationMessage,
      relatedJob: application.job._id,
      relatedApplication: application._id
    })

    // Send email notification
    try {
      await sendEmailNotification({
        to: application.applicant.email,
        subject: `Update on your application: ${application.job.title}`,
        template: notificationType,
        data: {
          userName: application.applicant.name,
          jobTitle: application.job.title,
          companyName: application.job.company,
          status: status,
          reviewNotes: reviewNotes || ''
        }
      })
    } catch (emailError) {
      console.error('Email notification failed:', emailError)
    }

    res.json({
      message: 'Application status updated successfully',
      application: {
        id: application._id,
        status: application.status,
        reviewedAt: application.reviewedAt
      }
    })
  } catch (error) {
    console.error('Update application status error:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

