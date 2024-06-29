import mongoose from "mongoose"

const AudiolecturesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    audio: {
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
export default mongoose.model("AudioLecture", AudiolecturesSchema);