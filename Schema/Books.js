import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "bookCategory"
    },
    bookImg: {
        type: String,
        required: true
    },
    pdfBookLink: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

export default mongoose.model("Book", bookSchema)