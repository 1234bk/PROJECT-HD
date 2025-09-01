import mongoose from "mongoose";


export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        console.log("MongoDB connected at the backend");
    }catch(error){
        console.log("Error in DB connection",error);
        process.exit(1);
    }
}
