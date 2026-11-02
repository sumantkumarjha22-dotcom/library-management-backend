import mongoose from "mongoose";

 const connectdb=async ()=>{
     try {

       
      const connect=await mongoose.connect(process.env.MONGO_URI)
      console.log("mongo db connected" )
      
     } catch (error) {
        console.log("error occure in db.js",error.message)
     }

 }
export { connectdb};

