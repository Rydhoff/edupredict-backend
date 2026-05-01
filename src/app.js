import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import conceptRoutes from "./routes/concept.routes.js";
import questionRoutes from "./routes/question.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import gamificationRoutes from "./routes/gamification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";
import profileRoutes from "./routes/profile.routes.js";

import { errorHandler, notFound } from "./middleware/error.middleware.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "EduPredict Math API is running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "EduPredict Math API",
    database: "MongoDB Atlas",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/concepts", conceptRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;