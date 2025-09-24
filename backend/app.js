import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import connectdb from './config/config.js'
import UserRoutes from './routes/user.routes.js'
import cors from 'cors'
import AdminRoutes from './routes/admin.routes.js'
import User from './model/user.model.js'
import bcrypt from 'bcrypt'
import CatalogRoutes from './routes/catalog.routes.js'
import MetricsRoutes from './routes/metrics.routes.js'
import JobRoutes from './routes/job.routes.js'
import Job from './model/job.model.js'


const app = express()
connectdb(process.env.MONGO_URL || 'mongodb://localhost:27017/jobportal');  

app.use(cors())
app.use(express.json())
app.use('/api/users',UserRoutes)
app.use('/api/admin', AdminRoutes)
app.use('/api/admin/catalog', CatalogRoutes)
app.use('/api/admin/metrics', MetricsRoutes)
app.use('/api/jobs', JobRoutes)

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))



const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
    // Seed a default admin user if not present (dev convenience)
    const seedAdmin = async () => {
        try {
            const email = process.env.ADMIN_EMAIL || 'admin@example.com'
            const existing = await User.findOne({ email })
            if (existing) return
            const password = process.env.ADMIN_PASSWORD || 'admin123'
            const hashed = await bcrypt.hash(password, 10)
            await User.create({
                name: process.env.ADMIN_NAME || 'Admin',
                email,
                password: hashed,
                role: 'admin'
            })
            console.log('Seeded default admin:', email)
        } catch (e) {
            console.error('Failed to seed admin', e)
        }
    }
    seedAdmin()
    // Seed jobs if empty
    const seedJobs = async () => {
        try{
            const count = await Job.countDocuments()
            if(count > 0) return
            await Job.insertMany([
                { title:'Senior Frontend Engineer', company:'TechCorp', location:'Remote', salary:'$90k - $120k', type:'Full-time', experience:'3-5 years', skills:['React','TypeScript','Tailwind CSS','Next.js'], description:'We are looking for a talented Frontend Engineer to join our team and help build amazing user experiences.', requirements:['3+ years of experience with React and modern JavaScript','Strong understanding of TypeScript','Experience with CSS frameworks like Tailwind CSS','Knowledge of Next.js or similar frameworks','Experience with version control (Git)','Strong problem-solving skills'], benefits:['Competitive salary and equity','Health, dental, and vision insurance','Flexible work arrangements','Professional development budget','Team building events','401(k) matching'], posted:'2 days ago', applicants:45 },
                { title:'Backend Developer', company:'FinTech Solutions', location:'New York, NY', salary:'$100k - $140k', type:'Full-time', experience:'2-4 years', skills:['Node.js','Python','PostgreSQL','AWS'], description:'Join our backend team to build scalable APIs and microservices for our financial platform.', requirements:['2+ years of backend development experience','Proficiency in Node.js and Python','Experience with PostgreSQL or similar databases','Knowledge of AWS cloud services','Understanding of RESTful API design','Experience with microservices architecture'], benefits:['Competitive salary package','Comprehensive health coverage','Remote work options','Learning and development opportunities','Stock options','Flexible PTO policy'], posted:'1 week ago', applicants:32 },
            ])
            console.log('Seeded jobs collection')
        }catch(e){ console.error('Failed to seed jobs', e) }
    }
    seedJobs()
})

