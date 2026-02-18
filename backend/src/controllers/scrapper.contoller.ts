import { Request, Response } from "express";
import { useScrapper } from "../services/useScrapper";
import prisma from "../lib/prisma";

export const useScrapperController = async (
    req: Request,
    res: Response
) => {
    try {
        const { prompt, targetUrl: reqTargetUrl } = req.body;

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const targetUrl = reqTargetUrl || process.env.GANDALF_URL || "https://gandalf.lakera.ai/";
        const answer = await useScrapper({ url: targetUrl, prompt })

        await prisma.promptQuery.create({
            data: {
                userId,
                prompt,
                response: answer,
            }
        })

        return res.status(200).json({
            success: true,
            data: { answer }
        })
    } catch (error) {
        console.error(`[GandalfController] error for user ${(req as any).user?.userId}`, error)

        return res.status(500).json({
            success: false,
            message: "An internal error occured while processing your request"
        });
    }
}