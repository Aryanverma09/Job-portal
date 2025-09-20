import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectdb from './config/config.js'
import UserRoutes from './routes/user.routes.js'
import cors from 'cors'


const app = express()
connectdb(process.env.MONGO_URL || 'mongodb://localhost:27017/jobportal');  

app.use(cors())
app.use(express.json())
app.use('/api/users',UserRoutes)

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

app.get('/',(req,res)=>{
    res.send("Hello")
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

