import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const ContactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    messages: [MessageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Contact", ContactUsSchema);
