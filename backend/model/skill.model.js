import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
}, { timestamps: true })

const Skill = mongoose.model('Skill', SkillSchema)
export default Skill



