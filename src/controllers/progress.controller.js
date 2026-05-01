import Question from "../models/question.model.js";
import QuizAttempt from "../models/quizAttempt.model.js";
import UserProgress from "../models/userProgress.model.js";
import UserGamification from "../models/userGamification.model.js";
import { updateUserProgress } from "../services/progress.service.js";
import {
  calculateXP,
  updateUserGamification,
  checkAndUnlockAchievements,
} from "../services/gamification.service.js";

export const submitQuizProgress = async (req, res) => {
  try {
    const { conceptId, answers, timeSpent = 0 } = req.body;

    if (!conceptId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Concept ID and answers array are required",
      });
    }

    const questionIds = answers.map((item) => item.questionId);

    const questions = await Question.find({
      _id: { $in: questionIds },
      concept: conceptId,
    });

    if (questions.length !== questionIds.length) {
      return res.status(400).json({
        message: "Some questions are invalid or not related to this concept",
      });
    }

    let correctCount = 0;

    const checkedAnswers = answers.map((answer) => {
      const question = questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      const isCorrect = question.correctAnswer === answer.userAnswer;

      if (isCorrect) {
        correctCount += 1;
      }

      return {
        question: question._id,
        userAnswer: answer.userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    const totalQuestions = checkedAnswers.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const xpEarned = calculateXP({ correctCount, score });

    const attempt = await QuizAttempt.create({
      user: req.user._id,
      concept: conceptId,
      answers: checkedAnswers,
      score,
      correctCount,
      totalQuestions,
      timeSpent,
      xpEarned,
    });

    const progress = await updateUserProgress({
      userId: req.user._id,
      conceptId,
      correctCount,
      totalQuestions,
      score,
    });

    const gamification = await updateUserGamification({
      userId: req.user._id,
      xpEarned,
    });

    const totalUserAttempts = await QuizAttempt.countDocuments({
  user: req.user._id,
});

const allProgress = await UserProgress.find({
  user: req.user._id,
});

const highestMasteryScore =
  allProgress.length === 0
    ? 0
    : Math.max(...allProgress.map((item) => item.masteryScore));

const unlockedAchievements = await checkAndUnlockAchievements({
  userId: req.user._id,
  score,
  totalUserAttempts,
  currentStreak: gamification.currentStreak,
  highestMasteryScore,
});

    res.status(201).json({
      message: "Progress saved successfully",
      result: {
        attemptId: attempt._id,
        score,
        correctCount,
        totalQuestions,
        timeSpent,
        xpEarned,
      },
      progress: {
        conceptId,
        masteryScore: progress.masteryScore,
        totalAttempts: progress.totalAttempts,
      },
      gamification: {
        totalXP: gamification.totalXP,
        level: gamification.level,
        currentStreak: gamification.currentStreak,
        bestStreak: gamification.bestStreak,
        xpToNextLevel: 100 - (gamification.totalXP % 100),
        unlockedAchievements,
        },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit progress",
      error: error.message,
    });
  }
};

export const getProgressStats = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user._id,
    });

    const totalAttempts = attempts.length;
    const totalQuestions = attempts.reduce(
      (sum, attempt) => sum + attempt.totalQuestions,
      0
    );
    const totalCorrect = attempts.reduce(
      (sum, attempt) => sum + attempt.correctCount,
      0
    );

    const averageScore =
      totalAttempts === 0
        ? 0
        : Math.round(
            attempts.reduce((sum, attempt) => sum + attempt.score, 0) /
              totalAttempts
          );

    const accuracy =
      totalQuestions === 0
        ? 0
        : Math.round((totalCorrect / totalQuestions) * 100);

    const gamification = await UserGamification.findOne({
      user: req.user._id,
    });

    res.json({
      stats: {
        totalAttempts,
        totalQuestions,
        totalCorrect,
        averageScore,
        accuracy,
        learningStatus:
          averageScore >= 80
            ? "Excellent Progress"
            : averageScore >= 60
            ? "Good Progress"
            : totalAttempts === 0
            ? "Start Learning"
            : "Needs Practice",
        totalXP: gamification?.totalXP || 0,
        level: gamification?.level || 1,
        currentStreak: gamification?.currentStreak || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get progress stats",
      error: error.message,
    });
  }
};

export const getConceptAnalysis = async (req, res) => {
  try {
    const progress = await UserProgress.find({
      user: req.user._id,
    })
      .populate("concept", "slug name description")
      .sort({ masteryScore: 1 });

    const weakestConcept = progress.length > 0 ? progress[0] : null;

    res.json({
      concepts: progress.map((item) => ({
        conceptId: item.concept._id,
        slug: item.concept.slug,
        conceptName: item.concept.name,
        description: item.concept.description,
        masteryScore: item.masteryScore,
        totalAttempts: item.totalAttempts,
        correctAttempts: item.correctAttempts,
        totalQuestionsAnswered: item.totalQuestionsAnswered,
        lastPracticedAt: item.lastPracticedAt,
        status:
          item.masteryScore >= 80
            ? "mastered"
            : item.masteryScore >= 50
            ? "improving"
            : "weak",
      })),
      weakestConcept: weakestConcept
        ? {
            conceptId: weakestConcept.concept._id,
            conceptName: weakestConcept.concept.name,
            masteryScore: weakestConcept.masteryScore,
          }
        : null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get concept analysis",
      error: error.message,
    });
  }
};