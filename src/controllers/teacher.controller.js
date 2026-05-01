import User from "../models/user.model.js";
import UserProgress from "../models/userProgress.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import Concept from "../models/concept.model.js";

export const getTeacherDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({
      role: "student",
    });

    const allProgress = await UserProgress.find();

    const averageMastery =
      allProgress.length === 0
        ? 0
        : Math.round(
            allProgress.reduce((sum, item) => sum + item.masteryScore, 0) /
              allProgress.length
          );

    const studentsNeedIntervention = await UserProgress.distinct("user", {
      masteryScore: { $lt: 50 },
    });

    const totalAttempts = await QuizAttempt.countDocuments();

    res.json({
      dashboard: {
        totalStudents,
        averageMastery,
        needIntervention: studentsNeedIntervention.length,
        totalQuizAttempts: totalAttempts,
        aiInterventions: studentsNeedIntervention.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get teacher dashboard",
      error: error.message,
    });
  }
};

export const getStudentsProgress = async (req, res) => {
  try {
    const students = await User.find({
      role: "student",
    }).select("name email createdAt");

    const data = await Promise.all(
      students.map(async (student) => {
        const progress = await UserProgress.find({
          user: student._id,
        }).populate("concept", "slug name");

        const attempts = await QuizAttempt.find({
          user: student._id,
        }).sort({ createdAt: -1 });

        const averageMastery =
          progress.length === 0
            ? 0
            : Math.round(
                progress.reduce((sum, item) => sum + item.masteryScore, 0) /
                  progress.length
              );

        const totalAttempts = attempts.length;

        const lastAttempt = attempts.length > 0 ? attempts[0] : null;

        const weakConcepts = progress
          .filter((item) => item.masteryScore < 50)
          .map((item) => ({
            conceptId: item.concept._id,
            conceptName: item.concept.name,
            masteryScore: item.masteryScore,
          }));

        let status = "developing";

        if (averageMastery >= 85) {
          status = "excellent";
        } else if (averageMastery >= 70) {
          status = "good";
        } else if (averageMastery < 50 && totalAttempts > 0) {
          status = "at risk";
        }

        return {
          studentId: student._id,
          name: student.name,
          email: student.email,
          totalAttempts,
          averageMastery,
          weakConcepts,
          lastScore: lastAttempt?.score || 0,
          lastActivity: lastAttempt?.createdAt || null,
          status,
          conceptsInProgress: progress.map((item) => ({
            conceptId: item.concept._id,
            conceptName: item.concept.name,
            masteryScore: item.masteryScore,
            totalAttempts: item.totalAttempts,
          })),
        };
      })
    );

    res.json({
      total: data.length,
      students: data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get students progress",
      error: error.message,
    });
  }
};

export const getConceptPerformance = async (req, res) => {
  try {
    const concepts = await Concept.find().sort({ name: 1 });

    const performance = await Promise.all(
      concepts.map(async (concept) => {
        const progress = await UserProgress.find({
          concept: concept._id,
        });

        const attempts = await QuizAttempt.find({
          concept: concept._id,
        });

        const averageMastery =
          progress.length === 0
            ? 0
            : Math.round(
                progress.reduce((sum, item) => sum + item.masteryScore, 0) /
                  progress.length
              );

        const totalQuestions = attempts.reduce(
          (sum, attempt) => sum + attempt.totalQuestions,
          0
        );

        const totalCorrect = attempts.reduce(
          (sum, attempt) => sum + attempt.correctCount,
          0
        );

        const accuracy =
          totalQuestions === 0
            ? 0
            : Math.round((totalCorrect / totalQuestions) * 100);

        const studentsNeedHelp = progress.filter(
          (item) => item.masteryScore < 50
        ).length;

        return {
          conceptId: concept._id,
          slug: concept.slug,
          conceptName: concept.name,
          description: concept.description,
          averageMastery,
          accuracy,
          totalAttempts: attempts.length,
          studentsPracticed: progress.length,
          studentsNeedHelp,
          status:
            averageMastery >= 80
              ? "strong"
              : averageMastery >= 50
              ? "moderate"
              : attempts.length === 0
              ? "no data"
              : "weak",
        };
      })
    );

    res.json({
      total: performance.length,
      concepts: performance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get concept performance",
      error: error.message,
    });
  }
};