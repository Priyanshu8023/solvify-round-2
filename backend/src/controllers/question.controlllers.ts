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

export const submitAnswer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { answer } = req.body;
        const userId = Number((req as any).user?.userId);

        if (!userId || isNaN(userId)) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const questionId = Number(id);

        const question = await prisma.question.findUnique({
            where: { id: questionId }
        });

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        if (question.answer !== answer) {
            return res.status(400).json({ message: "Incorrect answer" });
        }

        // Check if user already solved this question
        const alreadySolved = await prisma.solvedQuestion.findUnique({
            where: {
                userId_questionId: {
                    userId,
                    questionId
                }
            }
        });

        if (alreadySolved) {
            return res.status(200).json({ success: true, message: "Question already solved", alreadySolved: true });
        }

        // If correct and not solved before, create record and update questionsSolved
        await prisma.$transaction([
            prisma.solvedQuestion.create({
                data: {
                    userId,
                    questionId
                }
            }),
            prisma.user.update({
                where: { id: userId },
                data: {
                    questionsSolved: {
                        increment: 1
                    }
                }
            })
        ]);

        res.status(200).json({ success: true, message: "Correct answer! User score updated.", alreadySolved: false });
    } catch (error: any) {
        console.error("Submit Answer Error:", error);
        res.status(500).json({ message: "Something went wrong", error: error?.message || String(error) });
    }
};