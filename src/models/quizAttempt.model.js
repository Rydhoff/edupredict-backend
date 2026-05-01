import mongoose from "mongoose";

const attemptAnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    userAnswer: {
      type: String,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    },
    isCorrect: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    concept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concept",
      required: true,
    },
    answers: {
      type: [attemptAnswerSchema],
      default: [],
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    correctCount: {
      type: Number,
      required: true,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 0,
    },
    timeSpent: {
      type: Number,
      default: 0,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

quizAttemptSchema.index({ user: 1 });
quizAttemptSchema.index({ concept: 1 });
quizAttemptSchema.index({ createdAt: -1 });
quizAttemptSchema.index({ user: 1, concept: 1 });

const QuizAttempt = mongoose.model("QuizAttempt", quizAttemptSchema);

export default QuizAttempt;