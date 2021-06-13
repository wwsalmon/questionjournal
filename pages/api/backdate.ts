import {NextApiRequest, NextApiResponse} from "next";
import {QuestionModel} from "../../models/question";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).send("method not allowed");
    if (!(req.body.id && req.body.date)) return res.status(406).send("missing params");

    try {
        const newDate = new Date(req.body.date);
        const thisQuestion = await QuestionModel.findById(req.body.id);
        if (!thisQuestion) return res.status(404).send("question not found");
        thisQuestion.createdAt = newDate.toISOString();
        await thisQuestion.save();
        return res.status(200).send("Successfully saved");
    } catch (e) {
        return res.status(500).json({message: e});
    }
}