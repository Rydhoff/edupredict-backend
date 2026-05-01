import express from "express";
import {
  getMyProfile,
  updateMyPassword,
  updateMyPreferences,
  updateMyProfile,
} from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getMyProfile);
router.put("/", protect, updateMyProfile);
router.put("/preferences", protect, updateMyPreferences);
router.put("/password", protect, updateMyPassword);

export default router;