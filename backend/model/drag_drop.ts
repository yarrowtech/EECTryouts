import mongoose from "mongoose";

const dragDropSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: [String],
        required: true
    },
    options: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const DragDrop = mongoose.model("DragDrop", dragDropSchema, "dragdrops");

export default DragDrop;