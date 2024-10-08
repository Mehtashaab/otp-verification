import mongoose from "mongoose";
import { DB_NAME } from "../../constants.js";
// Connect to MongoDB

const connectDB = async()=>{
    try {
        const connect = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`Connected to MongoDB: ${connect.connection.host}`);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        
        
    }
}
export default connectDB;