import express from "express";
import {
  createConcept,
  getConceptById,
  getConcepts,
} from "../controllers/concept.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", protect, getConcepts);
router.get("/:id", protect, getConceptById);
router.post("/", protect, allowRoles("teacher"), createConcept);

export default router;