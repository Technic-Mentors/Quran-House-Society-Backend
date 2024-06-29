import mongoose from "mongoose";

const courseRegistrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    message: {
        type: String
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true })

export default mongoose.model("CourseRegistration", courseRegistrationSchema)