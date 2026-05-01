import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getQuestionById,
  getQuestions,
  updateQuestion,
} from "../controllers/question.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, getQuestions);
router.get("/:id", protect, getQuestionById);

router.post("/", protect, allowRoles("teacher"), createQuestion);
router.put("/:id", protect, allowRoles("teacher"), updateQuestion);
router.delete("/:id", protect, allowRoles("teacher"), deleteQuestion);

export default router;