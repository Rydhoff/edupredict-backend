import UserProgress from "../models/userProgress.model.js";

export const updateUserProgress = async ({
  userId,
  conceptId,
  correctCount,
  totalQuestions,
  score,
}) => {
  let progress = await UserProgress.findOne({
    user: userId,
    concept: conceptId,
  });

  if (!progress) {
    progress = await UserProgress.create({
      user: userId,
      concept: conceptId,
      masteryScore: score,
      totalAttempts: 1,
      correctAttempts: correctCount,
      totalQuestionsAnswered: totalQuestions,
      lastPracticedAt: new Date(),
    });

    return progress;
  }

  const oldMastery = progress.masteryScore || 0;
  const newMastery = Math.round(oldMastery * 0.7 + score * 0.3);

  progress.masteryScore = newMastery;
  progress.totalAttempts += 1;
  progress.correctAttempts += correctCount;
  progress.totalQuestionsAnswered += totalQuestions;
  progress.lastPracticedAt = new Date();

  await progress.save();

  return progress;
};