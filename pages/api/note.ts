import {NoteModel} from "../../models/note";
import dbConnect from "../../utils/dbConnect";
import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "next-auth/client";
import * as mongoose from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "GET": {
            const session = await getSession({ req });
            if (!session) return res.status(403).send("unauthed");
            if (!(req.query.questionId)) {
                return res.status(406).send("missing questionId");
            }

            try {
                let conditions = {};

                if (req.query.questionId) conditions["questionId"] = mongoose.Types.ObjectId(req.query.questionId);

                await dbConnect();

                const thisObject = await NoteModel.aggregate([
                    {$match: conditions},
                    {$lookup: {
                            from: "questions",
                            localField: "questionId",
                            foreignField: "_id",
                            as: "questionArr",
                    }}
                ]);

                if (!thisObject || !thisObject.length) return res.status(404).send("not found");

                if (!thisObject[0].questionArr.length || thisObject[0].questionArr[0].userId.toString() !== session.userId) {
                    return res.status(403).send("unauthed");
                }

                return res.status(200).json({data: thisObject});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }
        case "POST": {
            const session = await getSession({ req });
            if (!session) return res.status(403);
            try {
                await dbConnect();

                if (req.body.id) {
                    if (!(req.body.questionId || req.body.body)) {
                        return res.status(406);
                    }
                    const thisObject = await NoteModel.findById(req.body.id);
                    if (!thisObject) return res.status(404);

                    thisObject.questionId = req.body.questionId;
                    thisObject.body = req.body.body;

                    await thisObject.save();

                    return res.status(200).json({message: "Object updated"});
                } else {
                    if (!(req.body.questionId && req.body.body)) {
                        return res.status(406);
                    }

                    const newNote = new NoteModel({
                        questionId: req.body.questionId,
                        body: req.body.body,
                    });

                    const savedNote = await newNote.save();

                    return res.status(200).json({message: "Object created", id: savedNote._id.toString()});
                }
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }

        case "DELETE": {
            const session = await getSession({ req });
            if (!session) return res.status(403);

            if (!req.body.id) return res.status(406);

            try {
                await dbConnect();

                const thisObject = await NoteModel.findById(req.body.id);

                if (!thisObject) return res.status(404);
                if (thisObject.userId.toString() !== session.userId) return res.status(403);

                await NoteModel.deleteOne({_id: req.body.id});

                return res.status(200).json({message: "Object deleted"});
            } catch (e) {
                return res.status(500).json({message: e});
            }
        }

        default:
            return res.status(405);
    }
}