import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const mongoUri = process.env.MONGODB_URI
const connectToMongoDB = async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log("connect to mongoDb Successfully")
    } catch (error) {
        console.log(error)
    }
}

export default connectToMongoDB;