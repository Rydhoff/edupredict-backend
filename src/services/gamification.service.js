import UserGamification from "../models/userGamification.model.js";
import Achievement from "../models/achievement.model.js";
import UserAchievement from "../models/userAchievement.model.js";

const getDateOnly = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

const isSameDay = (dateA, dateB) => {
  return getDateOnly(dateA).getTime() === getDateOnly(dateB).getTime();
};

const isYesterday = (lastDate, today) => {
  const yesterday = getDateOnly(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return getDateOnly(lastDate).getTime() === yesterday.getTime();
};

export const calculateXP = ({ correctCount, score }) => {
  const correctXP = correctCount * 10;
  const completionBonus = 20;
  const perfectBonus = score === 100 ? 30 : 0;

  return correctXP + completionBonus + perfectBonus;
};

export const calculateLevel = (totalXP) => {
  return Math.floor(totalXP / 100) + 1;
};

export const updateUserGamification = async ({ userId, xpEarned }) => {
  let gamification = await UserGamification.findOne({ user: userId });

  if (!gamification) {
    gamification = await UserGamification.create({
      user: userId,
    });
  }

  const today = new Date();

  if (!gamification.lastActiveDate) {
    gamification.currentStreak = 1;
  } else if (isSameDay(gamification.lastActiveDate, today)) {
    gamification.currentStreak = gamification.currentStreak;
  } else if (isYesterday(gamification.lastActiveDate, today)) {
    gamification.currentStreak += 1;
  } else {
    gamification.currentStreak = 1;
  }

  gamification.totalXP += xpEarned;
  gamification.level = calculateLevel(gamification.totalXP);
  gamification.bestStreak = Math.max(
    gamification.bestStreak,
    gamification.currentStreak
  );
  gamification.lastActiveDate = today;

  await gamification.save();

  return gamification;
};

export const addBonusXP = async ({ userId, bonusXP }) => {
  const gamification = await UserGamification.findOne({ user: userId });

  if (!gamification) return null;

  gamification.totalXP += bonusXP;
  gamification.level = calculateLevel(gamification.totalXP);

  await gamification.save();

  return gamification;
};

export const unlockAchievement = async ({ userId, achievement }) => {
  const existing = await UserAchievement.findOne({
    user: userId,
    achievement: achievement._id,
  });

  if (existing) return null;

  const userAchievement = await UserAchievement.create({
    user: userId,
    achievement: achievement._id,
  });

  if (achievement.xpReward > 0) {
    await addBonusXP({
      userId,
      bonusXP: achievement.xpReward,
    });
  }

  return userAchievement;
};

export const checkAndUnlockAchievements = async ({
  userId,
  score,
  totalUserAttempts,
  currentStreak,
  highestMasteryScore,
}) => {
  const achievements = await Achievement.find();

  const unlockedAchievements = [];

  for (const achievement of achievements) {
    let shouldUnlock = false;

    if (
      achievement.conditionType === "FIRST_QUIZ" &&
      totalUserAttempts >= 1
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.conditionType === "PERFECT_SCORE" &&
      score === 100
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.conditionType === "STREAK" &&
      currentStreak >= achievement.conditionValue
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.conditionType === "TOTAL_QUIZ" &&
      totalUserAttempts >= achievement.conditionValue
    ) {
      shouldUnlock = true;
    }

    if (
      achievement.conditionType === "MASTERY_SCORE" &&
      highestMasteryScore >= achievement.conditionValue
    ) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlocked = await unlockAchievement({
        userId,
        achievement,
      });

      if (unlocked) {
        unlockedAchievements.push({
          id: achievement._id,
          code: achievement.code,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          xpReward: achievement.xpReward,
        });
      }
    }
  }

  return unlockedAchievements;
};