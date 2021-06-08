import {QuestionModel} from "../../models/question";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import mongoose from "mongoose";
import {SessionObj} from "../../utils/types";
import {NoteModel} from "../../models/note";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const session = await getSession({req});
            if (!session) return res.status(403);

            try {
                let conditions = {};
                conditions["userId"] = mongoose.Types.ObjectId(session.userId as string);

                await dbConnect();

                const thisObject = await QuestionModel.aggregate([
                    {$match: conditions},

                ]);

                if (!thisObject) return res.status(404);

                return res.status(200).json({data: thisObject});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        case "POST": {
            const session = await getSession({req});
            if (!session) return res.status(403);
            try {
                await dbConnect();

                if (req.body.id) {
                    if (!(req.body.question || req.body.tags || req.body.archived)) {
                        return res.status(406);
                    }

                    const thisObject = await QuestionModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);

                    if (req.body.question) thisObject.question = req.body.question;
                    if (req.body.tags) thisObject.tags = req.body.tags;
                    if (req.body.archived) thisObject.archived = req.body.archived;

                    await thisObject.save();

                    return res.status(200).json({message: "Object updated"});
                } else {
                    if (!(req.body.question)) {
                        return res.status(406);
                    }

                    const newQuestion = new QuestionModel({
                        archived: false,
                        question: req.body.question,
                        userId: session.userId,
                        tags: req.body.tags || [],
                    });

                    const savedQuestion = await newQuestion.save();

                    return res.status(200).json({message: "Object created", id: savedQuestion._id.toString()});
                }
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        case "DELETE": {
            const session = await getSession({req});
            if (!session) return res.status(403);

            if (!req.body.id) return res.status(406);

            try {
                await dbConnect();

                const thisObject = await QuestionModel.findById(req.body.id);

                if (!thisObject) return res.status(404);
                if (thisObject.userId.toString() !== session.userId) return res.status(403);

                await QuestionModel.deleteOne({_id: req.body.id});

                await NoteModel.deleteMany({questionId: req.body.id});

                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        default:
            return res.status(405);
    }
}