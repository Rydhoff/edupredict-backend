import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "🏆",
    },
    conditionType: {
      type: String,
      required: true,
      enum: [
        "FIRST_QUIZ",
        "PERFECT_SCORE",
        "STREAK",
        "TOTAL_QUIZ",
        "MASTERY_SCORE"
      ],
    },
    conditionValue: {
      type: Number,
      default: 1,
    },
    xpReward: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model("Achievement", achievementSchema);

export default Achievement;