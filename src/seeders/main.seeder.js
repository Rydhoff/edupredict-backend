import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";

import User from "../models/user.model.js";
import Concept from "../models/concept.model.js";
import Question from "../models/question.model.js";
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

const concepts = [
  {
    slug: "linear-equations",
    name: "Linear Equations",
    description: "Learn how to solve equations with one variable.",
  },
  {
    slug: "statistics",
    name: "Statistics",
    description: "Learn mean, median, mode, and data interpretation.",
  },
  {
    slug: "geometry",
    name: "Geometry",
    description: "Learn shapes, angles, area, and perimeter.",
  },
];

const questions = [
  {
    conceptSlug: "linear-equations",
    difficulty: "easy",
    questionText: "What is the solution to the equation 2x + 5 = 13?",
    options: [
      { label: "A", text: "x = 3" },
      { label: "B", text: "x = 4" },
      { label: "C", text: "x = 5" },
      { label: "D", text: "x = 6" },
    ],
    correctAnswer: "B",
    explanation:
      "Subtract 5 from both sides: 2x = 8. Then divide by 2, so x = 4.",
  },
  {
    conceptSlug: "linear-equations",
    difficulty: "medium",
    questionText: "Solve for x: 3x - 7 = 14.",
    options: [
      { label: "A", text: "x = 5" },
      { label: "B", text: "x = 6" },
      { label: "C", text: "x = 7" },
      { label: "D", text: "x = 8" },
    ],
    correctAnswer: "C",
    explanation:
      "Add 7 to both sides: 3x = 21. Divide by 3, so x = 7.",
  },
  {
    conceptSlug: "statistics",
    difficulty: "easy",
    questionText: "What is the mean of 4, 6, and 8?",
    options: [
      { label: "A", text: "5" },
      { label: "B", text: "6" },
      { label: "C", text: "7" },
      { label: "D", text: "8" },
    ],
    correctAnswer: "B",
    explanation:
      "Mean is total divided by number of values. (4 + 6 + 8) / 3 = 6.",
  },
  {
    conceptSlug: "statistics",
    difficulty: "medium",
    questionText: "What is the median of 3, 9, 5, 7, and 1?",
    options: [
      { label: "A", text: "3" },
      { label: "B", text: "5" },
      { label: "C", text: "7" },
      { label: "D", text: "9" },
    ],
    correctAnswer: "B",
    explanation:
      "Sort the numbers: 1, 3, 5, 7, 9. The middle number is 5.",
  },
  {
    conceptSlug: "geometry",
    difficulty: "easy",
    questionText: "What is the area of a rectangle with length 8 and width 4?",
    options: [
      { label: "A", text: "12" },
      { label: "B", text: "24" },
      { label: "C", text: "32" },
      { label: "D", text: "64" },
    ],
    correctAnswer: "C",
    explanation:
      "Area of a rectangle is length × width. So, 8 × 4 = 32.",
  },
  {
    conceptSlug: "geometry",
    difficulty: "medium",
    questionText: "A triangle has angles 60° and 50°. What is the third angle?",
    options: [
      { label: "A", text: "60°" },
      { label: "B", text: "70°" },
      { label: "C", text: "80°" },
      { label: "D", text: "90°" },
    ],
    correctAnswer: "B",
    explanation:
      "The sum of triangle angles is 180°. 180 - 60 - 50 = 70°.",
  },
];

const seed = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Concept.deleteMany();
    await Question.deleteMany();
    await Achievement.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    const teacher = await User.create({
      name: "Teacher 1",
      email: "teacher1@example.com",
      password: hashedPassword,
      role: "teacher",
    });

    await User.create({
      name: "Student 1",
      email: "student1@example.com",
      password: hashedPassword,
      role: "student",
    });

    const createdConcepts = await Concept.insertMany(concepts);

    const conceptMap = {};

    createdConcepts.forEach((concept) => {
      conceptMap[concept.slug] = concept._id;
    });

    const questionDocs = questions.map((question) => ({
      concept: conceptMap[question.conceptSlug],
      difficulty: question.difficulty,
      questionText: question.questionText,
      options: question.options,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      createdBy: teacher._id,
    }));

    await Question.insertMany(questionDocs);
    await Achievement.insertMany(achievements);

    console.log("Main seed completed successfully");
    console.log("Teacher login: teacher1@example.com / password123");
    console.log("Student login: student1@example.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();