import express from "express";
import { getStudentDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/student", protect, allowRoles("student"), getStudentDashboard);

export default router;