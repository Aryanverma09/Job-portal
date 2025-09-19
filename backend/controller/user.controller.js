import User from '../model/user.model.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const UserRegister =async (req,res)=>{
    console.log("Register route hit");
    const {name ,email ,password} = req.body
    if(!name || !email || !password){
        return res.status(400).json({ message: "name, email and password are required" })
    }
    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "Email already exists" })
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10)

        const newUser = new User({
            name ,
            email,
            password: hashed
        })
        await newUser.save()

        // create token
        const token = jwt.sign({ id: newUser._id, email: newUser.email, name: newUser.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

        // return user (without password) and token
        const userSafe = { id: newUser._id, name: newUser.name, email: newUser.email }
        return res.status(201).json({ message: "User Registered", user: userSafe, token })
    }catch(err){
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}

export const UserLogin = async(req,res)=>{
    const {email ,password}=req.body;
    if(!email || !password){
        return res.status(400).json({ message: "Email and Password are required" })
    }
    try{
        // find by email then compare password
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User does not exist" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ message: "Password is incorrect" })
        }

        // create token
        const token = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })

        const userSafe = { id: user._id, name: user.name, email: user.email }
        return res.status(200).json({ message: "User Login", user: userSafe, token })
    } catch(err){
        console.error(err)
        return res.status(500).json({ message: "Server error" })
    }
}