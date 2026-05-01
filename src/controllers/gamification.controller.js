import Achievement from "../models/achievement.model.js";
import UserAchievement from "../models/userAchievement.model.js";
import UserGamification from "../models/userGamification.model.js";

export const getMyGamification = async (req, res) => {
  try {
    let gamification = await UserGamification.findOne({
      user: req.user._id,
    });

    if (!gamification) {
      gamification = await UserGamification.create({
        user: req.user._id,
      });
    }

    const userAchievements = await UserAchievement.find({
      user: req.user._id,
    }).populate("achievement");

    res.json({
      gamification: {
        totalXP: gamification.totalXP,
        level: gamification.level,
        currentStreak: gamification.currentStreak,
        bestStreak: gamification.bestStreak,
        xpToNextLevel: 100 - (gamification.totalXP % 100),
        xpProgress: gamification.totalXP % 100,
        achievements: userAchievements.map((item) => ({
          id: item.achievement._id,
          code: item.achievement.code,
          title: item.achievement.title,
          description: item.achievement.description,
          icon: item.achievement.icon,
          xpReward: item.achievement.xpReward,
          unlockedAt: item.unlockedAt,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get gamification data",
      error: error.message,
    });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({
      conditionType: 1,
      conditionValue: 1,
    });

    let unlockedIds = [];

    if (req.user) {
      const userAchievements = await UserAchievement.find({
        user: req.user._id,
      });

      unlockedIds = userAchievements.map((item) =>
        item.achievement.toString()
      );
    }

    res.json({
      achievements: achievements.map((achievement) => ({
        id: achievement._id,
        code: achievement.code,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        conditionType: achievement.conditionType,
        conditionValue: achievement.conditionValue,
        xpReward: achievement.xpReward,
        unlocked: unlockedIds.includes(achievement._id.toString()),
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get achievements",
      error: error.message,
    });
  }
};