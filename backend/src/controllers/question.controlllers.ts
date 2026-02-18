import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getQuestion = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const question = await prisma.question.findUnique({
            where: { id: Number(id) }
        })

        res.status(200).json({ question })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" })
    }
}