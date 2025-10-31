import express from 'express'
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus
} from '../controller/application.controller.js'
import { requireAuth } from '../middleware/auth.js'

const ApplicationRoutes = express.Router()

// Apply for a job
ApplicationRoutes.post('/apply', requireAuth, applyForJob)

// Get user's applications
ApplicationRoutes.get('/my-applications', requireAuth, getMyApplications)

// Get applications for a specific job (employers)
ApplicationRoutes.get('/job/:jobId', requireAuth, getJobApplications)

// Update application status (employers)
ApplicationRoutes.put('/:applicationId/status', requireAuth, updateApplicationStatus)

export default ApplicationRoutes

