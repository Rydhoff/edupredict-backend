import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
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
    masteryScore: {
      type: Number,
      default: 0,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    correctAttempts: {
      type: Number,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    lastPracticedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ user: 1, concept: 1 }, { unique: true });
userProgressSchema.index({ masteryScore: 1 });
userProgressSchema.index({ updatedAt: -1 });

const UserProgress = mongoose.model("UserProgress", userProgressSchema);

export default UserProgress;