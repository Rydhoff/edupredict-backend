import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    concept: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Concept",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [optionSchema],
      required: true,
      validate: {
        validator(value) {
          return value.length >= 2;
        },
        message: "Question must have at least 2 options",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
      enum: ["A", "B", "C", "D"],
    },
    explanation: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ concept: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ questionText: "text" });
questionSchema.index({ createdBy: 1 });

const Question = mongoose.model("Question", questionSchema);

export default Question;