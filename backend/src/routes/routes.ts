import { Router } from "express";
import { signup, login } from "../controllers/auth.controllers";
import { protect } from "../middlewares/auth.middlewares";
import { useScrapperController } from "../controllers/scrapper.contoller";
import { getQuestion, submitAnswer } from "../controllers/question.controlllers";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/scrapper", protect, useScrapperController);
router.get("/:id", getQuestion);
router.post("/:id/submit", protect, submitAnswer);

export default router;