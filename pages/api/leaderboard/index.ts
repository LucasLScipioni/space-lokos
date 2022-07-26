import { verify } from "jsonwebtoken";
import CryptoJS from 'crypto-js';
import { NextApiRequest, NextApiResponse } from "next/types";
import { connectToDatabase } from "../../../db/mongo";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case "POST":
            await addToLeaderboard(req, res);
            break;
        case "GET":
            await getLeaderboard(req, res);
            break;
    }
}
const getLeaderboard = async (req: NextApiRequest, res: NextApiResponse) => {
    const { db } = await connectToDatabase();
    const leaderboard = db.collection("leaderboard");
    const leader = await leaderboard.find({}).sort({ score: -1 }).limit(10).toArray();
    res.status(200).json(leader);
}


const addToLeaderboard = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            message: "Missing required fields"
        });
        return;
    }
    const score = req.body.score;
    if (!process.env.JWT_SECRET) {
        throw new Error('Define the JWT_SECRET environmental variable');
    }
    const decoded = verify(token, process.env.JWT_SECRET) as { username: string, isGuest: boolean, country: string };

    const { db } = await connectToDatabase();

    try {
        const leaderboard = db.collection("leaderboard");
        const bytes = CryptoJS.AES.decrypt(`${score}`, "AVoc4t0");
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        const user = await leaderboard.findOne({ username: decoded.username });
        if (!user) {
            await leaderboard.insertOne({
                username: decoded.username,
                country: decoded.country,
                score: Number(decrypted),
            });
        }
        else {
            if (user.score < Number(decrypted)) {
                await leaderboard.updateOne(
                    { username: decoded.username },
                    { $set: { score: Number(decrypted) } }
                );
            }
        }
        res.status(200).json({
            message: "Score added to leaderboard"
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: "Something went wrong",
        });
    }
}