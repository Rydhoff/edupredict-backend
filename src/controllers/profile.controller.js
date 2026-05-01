import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

export const getMyProfile = async (req, res) => {
  try {
    res.json({
      profile: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        preferences: req.user.preferences,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user._id);

    user.name = name;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export const updateMyPreferences = async (req, res) => {
  try {
    const { adaptiveDifficulty, aiHelp, notification, theme } = req.body;

    const user = await User.findById(req.user._id);

    if (adaptiveDifficulty !== undefined) {
      user.preferences.adaptiveDifficulty = adaptiveDifficulty;
    }

    if (aiHelp !== undefined) {
      user.preferences.aiHelp = aiHelp;
    }

    if (notification !== undefined) {
      user.preferences.notification = notification;
    }

    if (theme !== undefined) {
      if (!["light", "dark"].includes(theme)) {
        return res.status(400).json({
          message: "Theme must be light or dark",
        });
      }

      user.preferences.theme = theme;
    }

    await user.save();

    res.json({
      message: "Preferences updated successfully",
      preferences: user.preferences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};

export const updateMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Current password, new password, and confirm password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update password",
      error: error.message,
    });
  }
};