import mongoose from 'mongoose';

const WebsiteSeoSchema = new mongoose.Schema({
    pageName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    keywords: { type: [String], required: true, default: [], lowercase: true },
    index: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('WebsiteSeo', WebsiteSeoSchema);
