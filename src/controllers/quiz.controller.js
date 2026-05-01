import Question from "../models/question.model.js";
import Concept from "../models/concept.model.js";

export const getQuizLibrary = async (req, res) => {
  try {
    const { difficulty, keyword } = req.query;

    const concepts = await Concept.find().sort({ name: 1 });

    const library = await Promise.all(
      concepts.map(async (concept) => {
        const questionFilter = {
          concept: concept._id,
        };

        if (difficulty) {
          questionFilter.difficulty = difficulty;
        }

        if (keyword) {
          questionFilter.questionText = {
            $regex: keyword,
            $options: "i",
          };
        }

        const totalQuestions = await Question.countDocuments(questionFilter);

        return {
          conceptId: concept._id,
          slug: concept.slug,
          title: concept.name,
          concept: concept.name,
          description: concept.description,
          difficulty: difficulty || "mixed",
          totalQuestions,
          estimatedTime: Math.max(totalQuestions * 2, 5),
        };
      })
    );

    const filteredLibrary = library.filter((item) => item.totalQuestions > 0);

    res.json({
      total: filteredLibrary.length,
      quizzes: filteredLibrary,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get quiz library",
      error: error.message,
    });
  }
};

export const startQuiz = async (req, res) => {
  try {
    const { conceptId, difficulty, limit = 10 } = req.query;

    if (!conceptId) {
      return res.status(400).json({
        message: "Concept ID is required",
      });
    }

    const concept = await Concept.findById(conceptId);

    if (!concept) {
      return res.status(404).json({
        message: "Concept not found",
      });
    }

    const match = {
      concept: concept._id,
    };

    if (difficulty) {
      match.difficulty = difficulty;
    }

    const questions = await Question.aggregate([
      { $match: match },
      { $sample: { size: Number(limit) } },
      {
        $project: {
          concept: 1,
          difficulty: 1,
          questionText: 1,
          options: 1,
          explanation: 1,
          createdAt: 1
        },
      },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        message: "No questions available for this quiz",
      });
    }

    res.json({
      quiz: {
        conceptId: concept._id,
        conceptName: concept.name,
        difficulty: difficulty || "mixed",
        totalQuestions: questions.length,
        timer: questions.length * 120,
        questions,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to start quiz",
      error: error.message,
    });
  }
};

export const getQuizRecommendation = async (req, res) => {
  try {
    const concepts = await Concept.find().sort({ createdAt: 1 });

    if (concepts.length === 0) {
      return res.status(404).json({
        message: "No concepts available",
      });
    }

    const recommendedConcept = concepts[0];

    const questions = await Question.aggregate([
      {
        $match: {
          concept: recommendedConcept._id,
        },
      },
      {
        $sample: {
          size: 5,
        },
      },
      {
        $project: {
          concept: 1,
          difficulty: 1,
          questionText: 1,
          options: 1,
          explanation: 1,
          createdAt: 1,
        },
      },
    ]);

    res.json({
      recommendedConcept: {
        id: recommendedConcept._id,
        slug: recommendedConcept.slug,
        name: recommendedConcept.name,
      },
      reason:
        "Start with this concept first. Personalized recommendation will improve after you complete quizzes.",
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get quiz recommendation",
      error: error.message,
    });
  }
};