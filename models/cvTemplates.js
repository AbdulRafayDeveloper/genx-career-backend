import mongoose from "mongoose";

const cvTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Template name is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Template image URL is required"],
      trim: true,
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("cvtemplates", cvTemplateSchema);
