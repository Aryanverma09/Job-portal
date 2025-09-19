import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectdb from './config/config.js'
import UserRoutes from './routes/user.routes.js'
import cors from 'cors'


const app = express()
connectdb(process.env.MONGO_URL);  

app.use(cors())
app.use(express.json())
app.use('/api/users',UserRoutes)

app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})

