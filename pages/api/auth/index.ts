import { NextApiRequest, NextApiResponse } from "next"
import { connectToDatabase } from "../../../db/mongo";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case "GET":
            await login(req, res);
            break;
        case "POST":
            await addUser(req, res);
            break;
    }

}
const login = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, password } = req.query;
    const { db } = await connectToDatabase();
    if (!username || !password) {
        res.status(400).json({
            message: "Missing required fields"
        });
        return;
    }
    try {
        console.log(username);
        const users = db.collection("users");
        const user = await users.findOne({ username });
        if (!user) {
            res.status(401).json({
                message: "Invalid username or password",
            });
            return;
        }

        const valid = await bcrypt.compare(password as string, user.password);

        if (!valid) {
            res.status(401).json({
                message: "Invalid username or password",
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('Define the JWT_SECRET environmental variable');
        }

        const token = sign({ userId: user._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(400).json({
            message: "Something went wrong",
        });
    }
}

const addUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const { username, country, password } = req.body;
    const { db } = await connectToDatabase();
    if (!username || !country || !password) {
        res.status(400).json({
            success: false,
            message: "Missing required fields"
        });
        return;
    }
    if (username.length < 3 || country.length < 3 || password.length < 3) {
        res.status(400).json({
            success: false,
            message: "Username and password must be at least 3 characters long"
        });
        return;
    }
    try {
        const collection = db.collection("users");
        await collection.insertOne({
            username,
            country,
            password: bcrypt.hashSync(password, 10)
        });
        res.status(201).json({
            success: true,
            message: "User added"
        });
    } catch (err: any) {
        console.error(err.code);
        if (err.code === 11000) {
            res.status(400).json({
                success: false,
                message: "Username already exists"
            });
        } else {
            res.status(400).json({
                success: false,
                message: "Something went wrong"
            });
        }

    }


}