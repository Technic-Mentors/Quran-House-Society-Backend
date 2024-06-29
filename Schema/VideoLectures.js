import mongoose from "mongoose"

const VideolecturesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    video: {
        type: String
    },
    lecImg: {
        type: String
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "lectureCategory"
    },
    powerPointLink: {
        type: String
    },
    pdfLink: {
        type: String
    },
},
    { timestamps: true }
)
export default mongoose.model("VideoLecture", VideolecturesSchema);