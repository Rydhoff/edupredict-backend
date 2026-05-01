import QuizAttempt from "../models/quizAttempt.model.js";
import UserProgress from "../models/userProgress.model.js";
import UserGamification from "../models/userGamification.model.js";
import Concept from "../models/concept.model.js";
import Question from "../models/question.model.js";

export const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const attempts = await QuizAttempt.find({ user: userId })
      .populate("concept", "slug name description")
      .sort({ createdAt: -1 })
      .limit(5);

    const allAttempts = await QuizAttempt.find({ user: userId });

    const progress = await UserProgress.find({ user: userId })
      .populate("concept", "slug name description")
      .sort({ masteryScore: 1 });

    let gamification = await UserGamification.findOne({ user: userId });

    if (!gamification) {
      gamification = await UserGamification.create({
        user: userId,
      });
    }

    const totalQuizzesCompleted = allAttempts.length;

    const totalQuestions = allAttempts.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0
    );

    const totalCorrect = allAttempts.reduce(
      (sum, attempt) => sum + attempt.correctCount,
      0
    );

    const accuracyRate =
      totalQuestions === 0
        ? 0
        : Math.round((totalCorrect / totalQuestions) * 100);

    const averageScore =
      totalQuizzesCompleted === 0
        ? 0
        : Math.round(
            allAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
              totalQuizzesCompleted
          );

    const overallMastery =
      progress.length === 0
        ? 0
        : Math.round(
            progress.reduce((sum, item) => sum + item.masteryScore, 0) /
              progress.length
          );

    const timeSpent = allAttempts.reduce(
      (sum, attempt) => sum + attempt.timeSpent,
      0
    );

    const weakestProgress = progress.length > 0 ? progress[0] : null;

    let recommendedConcept = null;
    let recommendationReason = "";

    if (weakestProgress) {
      recommendedConcept = weakestProgress.concept;
      recommendationReason = `Focus on ${weakestProgress.concept.name} because your mastery score is still ${weakestProgress.masteryScore}%.`;
    } else {
      const firstConcept = await Concept.findOne().sort({ createdAt: 1 });

      if (firstConcept) {
        recommendedConcept = firstConcept;
        recommendationReason =
          "Start your first quiz to unlock personalized learning recommendations.";
      }
    }

    let recommendedPractice = null;

    if (recommendedConcept) {
      const availableQuestions = await Question.countDocuments({
        concept: recommendedConcept._id,
      });

      recommendedPractice = {
        conceptId: recommendedConcept._id,
        slug: recommendedConcept.slug,
        title: recommendedConcept.name,
        description: recommendedConcept.description,
        totalQuestions: availableQuestions,
        reason: recommendationReason,
      };
    }

    const aiInsight =
      totalQuizzesCompleted === 0
        ? "Start your first quiz to unlock AI learning insight."
        : weakestProgress
        ? `Your weakest topic is ${weakestProgress.concept.name}. Practice this topic to improve your overall mastery.`
        : "Great progress. Keep practicing consistently.";

    res.json({
      dashboard: {
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        },
        stats: {
          totalQuizzesCompleted,
          accuracyRate,
          averageScore,
          overallMastery,
          timeSpent,
        },
        gamification: {
          totalXP: gamification.totalXP,
          level: gamification.level,
          currentStreak: gamification.currentStreak,
          bestStreak: gamification.bestStreak,
          xpProgress: gamification.totalXP % 100,
          xpToNextLevel: 100 - (gamification.totalXP % 100),
        },
        aiInsight,
        skillProgress: progress.map((item) => ({
          conceptId: item.concept._id,
          slug: item.concept.slug,
          conceptName: item.concept.name,
          masteryScore: item.masteryScore,
          totalAttempts: item.totalAttempts,
          status:
            item.masteryScore >= 80
              ? "mastered"
              : item.masteryScore >= 50
              ? "improving"
              : "weak",
        })),
        recentActivity: attempts.map((attempt) => ({
          attemptId: attempt._id,
          conceptId: attempt.concept._id,
          conceptName: attempt.concept.name,
          score: attempt.score,
          correctCount: attempt.correctCount,
          totalQuestions: attempt.totalQuestions,
          xpEarned: attempt.xpEarned,
          createdAt: attempt.createdAt,
        })),
        recommendedPractice,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get student dashboard",
      error: error.message,
    });
  }
};