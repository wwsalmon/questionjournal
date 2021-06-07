import mongoose, {Document, Model} from "mongoose";
import {QuestionObj} from "../utils/types";

interface QuestionDoc extends QuestionObj, Document {}

const QuestionSchema = new mongoose.Schema({
    archived: { required: true, type: Boolean },
    question: { required: true, type: String },
    userId: { required: true, type: mongoose.Schema.Types.ObjectId },
    tags: { required: true, type: [String] },
}, {
    timestamps: true,
});

export const QuestionModel = mongoose.models.question || mongoose.model<QuestionDoc>("question", QuestionSchema);