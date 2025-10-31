import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Applied', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  coverLetter: {
    type: String,
    default: ''
  },
  resumePath: {
    type: String,
    default: ''
  },
  appliedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true })

// Index for efficient queries
applicationSchema.index({ job: 1, applicant: 1 })
applicationSchema.index({ applicant: 1 })
applicationSchema.index({ job: 1 })

const Application = mongoose.model('Application', applicationSchema)
export default Application

