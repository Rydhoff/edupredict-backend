import express from "express";
import {
  getConceptAnalysis,
  getProgressStats,
  submitQuizProgress,
} from "../controllers/progress.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/submit", protect, allowRoles("student"), submitQuizProgress);
router.get("/stats", protect, allowRoles("student"), getProgressStats);
router.get(
  "/concept-analysis",
  protect,
  allowRoles("student"),
  getConceptAnalysis
);

export default router;