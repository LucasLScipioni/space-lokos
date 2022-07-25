import {  NextApiRequest, NextApiResponse } from "next"
import { sign } from "jsonwebtoken";
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    switch (req.method) {
        case "GET":
            await guest(req,res);
        break;
    }
}
function randomIntFromInterval(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
const guest = async (req:NextApiRequest,res:NextApiResponse) => {
    const username = req.query.username as string;

    if(!process.env.JWT_SECRET){
        throw new Error('Define the JWT_SECRET environmental variable');
    }
    const guestUsername = `${username}-${randomIntFromInterval(1000,9999)}`;
    const token = sign({ username: guestUsername,isGuest:true }, process.env.JWT_SECRET);
    res.status(200).json({
        token,
        username:guestUsername
    });
}