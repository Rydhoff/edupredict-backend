import express from "express";
import {
  getConceptPerformance,
  getStudentsProgress,
  getTeacherDashboard,
} from "../controllers/teacher.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, allowRoles("teacher"), getTeacherDashboard);
router.get(
  "/students-progress",
  protect,
  allowRoles("teacher"),
  getStudentsProgress
);
router.get(
  "/concept-performance",
  protect,
  allowRoles("teacher"),
  getConceptPerformance
);

export default router;