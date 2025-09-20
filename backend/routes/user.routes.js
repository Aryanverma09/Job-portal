import express from 'express'
import { UserLogin, UserRegister, uploadResume, getMatchedJobs, uploadMiddleware } from '../controller/user.controller.js'

const UserRoutes = express.Router()

// actual routes
UserRoutes.post('/register', UserRegister )
// use POST for login so the JSON body is available on req.body
UserRoutes.post('/login', UserLogin)
UserRoutes.post('/upload-resume', uploadMiddleware, uploadResume)
UserRoutes.post('/get-matched-jobs', getMatchedJobs)

export default UserRoutes
