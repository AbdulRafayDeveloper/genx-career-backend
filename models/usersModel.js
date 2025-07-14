import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    otp: {
      type: String,
      required: false,
    },
    otpCreatedAt: {
      type: Date,
      required: false,
    },
    otpExpiresAt: {
      type: Date,
      required: false,
    },
    role: {
      type: String,
      enums: ["user", "admin"],
      default: "user",
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: true,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", userSchema);
