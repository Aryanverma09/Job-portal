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