import mongoose from "mongoose";

const connectdb =async (mongoUri)=>{
    try{
        await mongoose.connect(mongoUri,{
            useNewUrlParser: true,
      useUnifiedTopology: true,
        });
        console.log("connect to db")
    } catch(err){
        console.log(err)
    }
}
export default connectdb