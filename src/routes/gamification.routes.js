import express from "express";
import {
  getAchievements,
  getMyGamification,
} from "../controllers/gamification.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/me", protect, allowRoles("student"), getMyGamification);
router.get("/achievements", protect, allowRoles("student"), getAchievements);

export default router;