import mongoose from "mongoose";

const connectdb = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb connected successfully")
    } catch (error) {
        console.error("connection failed",error.message);
    }
};

export default connectdb;