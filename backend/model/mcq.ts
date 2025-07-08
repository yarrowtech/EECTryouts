import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
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

const MCQModel = mongoose.model("MCQ", mcqSchema, "mcqs");

export default MCQModel;