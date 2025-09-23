import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { audit } from '../middleware/audit.js'
import Job from '../model/job.model.js'

const JobRoutes = express.Router()

// DB-backed routes

JobRoutes.get('/', async (req, res) => {
  try{
    const jobs = await Job.find({}).sort({ createdAt: -1 }).lean()
    const mapped = jobs.map(j => ({
      id: String(j._id),
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      type: j.type,
      experience: j.experience,
      skills: j.skills,
      description: j.description,
      requirements: j.requirements,
      benefits: j.benefits,
      posted: j.posted,
      applicants: j.applicants
    }))
    res.json({ jobs: mapped })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

JobRoutes.get('/:id', async (req, res) => {
  try{
    const j = await Job.findById(req.params.id).lean()
    if(!j) return res.status(404).json({ message:'Job not found' })
    const job = {
      id: String(j._id),
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      type: j.type,
      experience: j.experience,
      skills: j.skills,
      description: j.description,
      requirements: j.requirements,
      benefits: j.benefits,
      posted: j.posted,
      applicants: j.applicants
    }
    res.json({ job })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

JobRoutes.post('/:id/apply', async (req, res) => {
  try{
    const job = await Job.findByIdAndUpdate(req.params.id, { $inc:{ applicants:1 } }, { new:true })
    if(!job) return res.status(404).json({ message:'Job not found' })
    res.json({ message:'Application submitted successfully', applicants: job.applicants })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

// Admin CRUD endpoints
JobRoutes.post('/', requireAuth, requireAdmin, audit('admin.jobs.create'), async (req, res) => {
  try{
    const {
      title, company, location, salary, type,
      experience, skills = [], description = '',
      requirements = [], benefits = [], posted = 'today'
    } = req.body || {}
    if (!title || !company) return res.status(400).json({ message: 'title and company are required' })
    const created = await Job.create({ title, company, location, salary, type, experience, skills, description, requirements, benefits, posted })
    res.status(201).json({ job: { id:String(created._id), ...created.toObject() } })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

JobRoutes.put('/:id', requireAuth, requireAdmin, audit('admin.jobs.update', (req)=>({ type:'job', id:req.params.id })), async (req, res) => {
  try{
    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new:true })
    if(!updated) return res.status(404).json({ message:'Job not found' })
    res.json({ job: { id:String(updated._id), ...updated.toObject() } })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

JobRoutes.delete('/:id', requireAuth, requireAdmin, audit('admin.jobs.delete', (req)=>({ type:'job', id:req.params.id })), async (req, res) => {
  try{
    const removed = await Job.findByIdAndDelete(req.params.id)
    if(!removed) return res.status(404).json({ message:'Job not found' })
    res.json({ message: 'Job deleted', job: { id:String(removed._id) } })
  }catch(e){ res.status(500).json({ message:'Server error' }) }
})

export default JobRoutes



