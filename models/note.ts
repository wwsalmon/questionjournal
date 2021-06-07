import mongoose, {Document, Model} from "mongoose";
import {NoteObj} from "../utils/types";

interface NoteDoc extends NoteObj, Document {}

const NoteSchema = new mongoose.Schema({
    questionId: { required: true, type: mongoose.Schema.Types.ObjectId },
    body: { required: true, type: String },
}, {
    timestamps: true,
});

export const NoteModel = mongoose.models.note || mongoose.model<NoteDoc>("note", NoteSchema);