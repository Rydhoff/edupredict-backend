import mongoose from "mongoose";

const userPreferencesSchema = new mongoose.Schema(
  {
    adaptiveDifficulty: {
      type: Boolean,
      default: true,
    },
    aiHelp: {
      type: Boolean,
      default: true,
    },
    notification: {
      type: Boolean,
      default: true,
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({
        adaptiveDifficulty: true,
        aiHelp: true,
        notification: true,
        theme: "light",
      }),
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;