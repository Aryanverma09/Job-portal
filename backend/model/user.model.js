import mongoose, { model } from 'mongoose'

const userSchema = new mongoose.Schema({
    name :{
        type : String,
        required : true,
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    resume: {
        originalName: String,
        fileName: String,
        filePath: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        },
        parsedData: {
            skills: [String],
            experience: [String],
            education: [String],
            summary: String
        }
    }
})

const User = mongoose.model("User" , userSchema)
export default User