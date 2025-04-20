import mongoose from "mongoose";

const cvCreationsSchema = new mongoose.Schema(
  {
    cvTemplate: {
      type: String,
      required: true,
    },
    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "cvtemplates",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const cvCreatorsSchema = new mongoose.Schema(
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
    result: [cvCreationsSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("cvCreators", cvCreatorsSchema);
