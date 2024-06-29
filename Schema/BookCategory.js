import mongoose from "mongoose"

const bookCatSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

export default mongoose.model("bookCategory", bookCatSchema)