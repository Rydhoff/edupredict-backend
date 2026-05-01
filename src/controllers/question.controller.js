import Question from "../models/question.model.js";
import Concept from "../models/concept.model.js";

const isCorrectAnswerValid = (options, correctAnswer) => {
  return options.some((option) => option.label === correctAnswer);
};

export const createQuestion = async (req, res) => {
  try {
    const {
      conceptId,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    if (!conceptId || !difficulty || !questionText || !options || !correctAnswer) {
      return res.status(400).json({
        message:
          "Concept ID, difficulty, question text, options, and correct answer are required",
      });
    }

    const concept = await Concept.findById(conceptId);

    if (!concept) {
      return res.status(404).json({
        message: "Concept not found",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "Options must be an array with at least 2 items",
      });
    }

    if (!isCorrectAnswerValid(options, correctAnswer)) {
      return res.status(400).json({
        message: "Correct answer must match one of the option labels",
      });
    }

    const question = await Question.create({
      concept: conceptId,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
      createdBy: req.user._id,
    });

    const populatedQuestion = await question.populate([
      { path: "concept", select: "slug name description" },
      { path: "createdBy", select: "name email role" },
    ]);

    res.status(201).json({
      message: "Question created successfully",
      question: populatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create question",
      error: error.message,
    });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const { conceptId, difficulty, keyword } = req.query;

    const filter = {};

    if (conceptId) {
      filter.concept = conceptId;
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (keyword) {
      filter.questionText = {
        $regex: keyword,
        $options: "i",
      };
    }

    const questions = await Question.find(filter)
      .populate("concept", "slug name description")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      total: questions.length,
      questions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get questions",
      error: error.message,
    });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("concept", "slug name description")
      .populate("createdBy", "name email role");

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    res.json({
      question,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get question",
      error: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const {
      conceptId,
      difficulty,
      questionText,
      options,
      correctAnswer,
      explanation,
    } = req.body;

    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    if (conceptId) {
      const concept = await Concept.findById(conceptId);

      if (!concept) {
        return res.status(404).json({
          message: "Concept not found",
        });
      }

      question.concept = conceptId;
    }

    if (difficulty) question.difficulty = difficulty;
    if (questionText) question.questionText = questionText;
    if (explanation !== undefined) question.explanation = explanation;

    if (options) {
      if (!Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          message: "Options must be an array with at least 2 items",
        });
      }

      question.options = options;
    }

    if (correctAnswer) {
      const finalOptions = options || question.options;

      if (!isCorrectAnswerValid(finalOptions, correctAnswer)) {
        return res.status(400).json({
          message: "Correct answer must match one of the option labels",
        });
      }

      question.correctAnswer = correctAnswer;
    }

    await question.save();

    const updatedQuestion = await Question.findById(question._id)
      .populate("concept", "slug name description")
      .populate("createdBy", "name email role");

    res.json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update question",
      error: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    await question.deleteOne();

    res.json({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete question",
      error: error.message,
    });
  }
};