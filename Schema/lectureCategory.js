import mongoose from "mongoose"

const lectureCatSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

export default mongoose.model("lectureCategory", lectureCatSchema)