import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Achievement from "../models/achievement.model.js";

dotenv.config();

const achievements = [
  {
    code: "FIRST_QUIZ",
    title: "First Quiz",
    description: "Complete your first quiz.",
    icon: "🎯",
    conditionType: "FIRST_QUIZ",
    conditionValue: 1,
    xpReward: 20,
  },
  {
    code: "PERFECT_SCORE",
    title: "Perfect Score",
    description: "Get 100% score on a quiz.",
    icon: "🌟",
    conditionType: "PERFECT_SCORE",
    conditionValue: 100,
    xpReward: 30,
  },
  {
    code: "STREAK_5",
    title: "5-Day Streak",
    description: "Study for 5 days in a row.",
    icon: "🔥",
    conditionType: "STREAK",
    conditionValue: 5,
    xpReward: 50,
  },
  {
    code: "MATH_MASTER_50",
    title: "Math Master",
    description: "Complete 50 quizzes.",
    icon: "🏆",
    conditionType: "TOTAL_QUIZ",
    conditionValue: 50,
    xpReward: 100,
  },
  {
    code: "MASTERY_90",
    title: "Concept Master",
    description: "Reach 90% mastery in any concept.",
    icon: "🧠",
    conditionType: "MASTERY_SCORE",
    conditionValue: 90,
    xpReward: 70,
  },
];

const seedAchievements = async () => {
  try {
    await connectDB();

    await Achievement.deleteMany();
    await Achievement.insertMany(achievements);

    console.log("Achievements seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed achievements:", error.message);
    process.exit(1);
  }
};

seedAchievements();