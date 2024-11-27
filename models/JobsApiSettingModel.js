import mongoose from "mongoose";

const jobsApiSettingsSchema = new mongoose.Schema(
  {
    pageNumber: {
      type: Number,
      required: true,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("jobsApiSettings", jobsApiSettingsSchema);
