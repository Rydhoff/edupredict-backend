import express from "express";
import {
  getQuizLibrary,
  getQuizRecommendation,
  startQuiz,
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, getQuizLibrary);
router.get("/start", protect, allowRoles("student", "teacher"), startQuiz);
router.get("/recommendation", protect, allowRoles("student"), getQuizRecommendation);

export default router;