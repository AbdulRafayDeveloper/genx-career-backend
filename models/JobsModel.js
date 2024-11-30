import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema(
  {
    thierStackJobId: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: false,
    },
    minAnnualSalary: {
      type: Number,
      required: false,
    },
    maxAnnualSalary: {
      type: Number,
      required: false,
    },
    salaryCurrency: {
      type: String,
      required: false,
    },
    industry: {
      type: String,
      required: false,
    },
    employment_statuses: {
      type: [String],
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    jobPostDate: {
      type: Date,
      required: false,
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
    seniority: {
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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('jobs', jobsSchema);
