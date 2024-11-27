import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    applyUrl: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    finalUrl: {
      type: String,
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    stateCode: {
      type: String,
      required: false,
    },
    remote: {
      type: Boolean,
      required: false,
      default: false,
    },
    hybrid: {
      type: Boolean,
      required: false,
      default: false,
    },
    country: {
      type: String,
      required: true,
    },
    seniority: {
      type: String,
      required: false,
    },
    salary: {
      type: String,
      required: false,
    },
    salaryCurrency: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    industry: {
      type: String,
      required: false,
    },
    companyLogoLink: {
      type: String,
      required: false,
    },
    companyUrl: {
      type: String,
      required: false,
    },
    numberOfJobs: {
      type: Number,
      required: false,
    },
    foundedYear: {
      type: Number,
      required: false,
    },
    jobPostDate: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("jobs", jobSchema);
