import mongoose from "mongoose";

const matchingSchema = new mongoose.Schema(
  {
    cvContext: {
      type: String,
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing a Job
      ref: "jobs", // Reference to the Jobs collection
      required: true,
    },
    matchingOutput: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cvMatchersSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for referencing a User
      ref: "users", // Reference to the Users collection
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    result: [matchingSchema], // Embedded array of matching results
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("cvMatchers", cvMatchersSchema);
