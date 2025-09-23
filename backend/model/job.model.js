import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: '' },
  salary: { type: String, default: '' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'], default: 'Full-time' },
  experience: { type: String, default: '' },
  skills: { type: [String], default: [] },
  description: { type: String, default: '' },
  requirements: { type: [String], default: [] },
  benefits: { type: [String], default: [] },
  posted: { type: String, default: 'today' },
  applicants: { type: Number, default: 0 }
}, { timestamps: true })

const Job = mongoose.model('Job', jobSchema)
export default Job


