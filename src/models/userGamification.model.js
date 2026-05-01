import mongoose from "mongoose";

const userGamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalXP: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userGamificationSchema.index({ totalXP: -1 });
userGamificationSchema.index({ level: -1 });

const UserGamification = mongoose.model(
  "UserGamification",
  userGamificationSchema
);

export default UserGamification;