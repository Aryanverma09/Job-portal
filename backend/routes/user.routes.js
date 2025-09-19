import express from 'express'
import { UserLogin, UserRegister } from '../controller/user.controller.js'

const UserRoutes = express.Router()

// actual routes
UserRoutes.post('/register', UserRegister )
// use POST for login so the JSON body is available on req.body
UserRoutes.post('/login', UserLogin)

export default UserRoutes
