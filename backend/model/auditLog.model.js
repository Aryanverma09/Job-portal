import mongoose from 'mongoose'

const AuditLogSchema = new mongoose.Schema({
    actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    action: { type: String, required: true, index: true },
    resource: {
        type: { type: String },
        id: { type: String }
    },
    meta: { type: Object },
    ip: String,
    userAgent: String,
}, { timestamps: { createdAt: true, updatedAt: false } })

const AuditLog = mongoose.model('AuditLog', AuditLogSchema)
export default AuditLog



