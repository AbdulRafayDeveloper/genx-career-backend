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
        email: {
            type: String,
            required: true,
        },
        subject: {
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
