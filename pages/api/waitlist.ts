import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.email || !req.body.url) return res.status(405).json({message: "Missing email or URL in request body"});

    try {
        const waitlistApiRes = await axios.post("https://getwaitlist.com/waitlist", {
            email: req.body.email,
            api_key: process.env.WAITLIST_API_KEY,
            referral_link: req.body.url,
        });

        return res.status(200).json({data: waitlistApiRes.data});
    } catch (e) {
        return res.status(500).json({data: e});
    }
}