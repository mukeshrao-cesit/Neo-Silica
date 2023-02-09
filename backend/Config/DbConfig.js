import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


const connectDB = async () => {
    try {
        console.log("started");
        const connection = await mongoose.connect(process.env.MONGO_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log("Database Connected");

    } catch (error) {

        console.log(`DB Error:${error}`);
    }
}

export default connectDB;