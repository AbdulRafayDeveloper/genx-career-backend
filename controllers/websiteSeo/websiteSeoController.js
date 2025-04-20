import WebsiteSeo from "../../models/WebsiteSeo.js";
import mongoose from "mongoose";
import {
    notFoundResponse,
    badRequestResponse,
    serverErrorResponse,
    successResponse
} from "../../helpers/apiResponsesHelpers.js";

const addWebsiteSeo = async (req, res) => {
    try {

        console.log("req.body: ", req.body);
        const { pageName, title, description, keywords, index } = req.body;

        if (!pageName || !title || !description || !Array.isArray(keywords) || keywords.length === 0) {
            return badRequestResponse(res, "All fields (pageName, title, description, keywords) are required.");
        }

        const existingSeo = await WebsiteSeo.findOne({ pageName });

        if (existingSeo) {
            return badRequestResponse(res, "SEO for this page already exists.");
        }

        const newSeo = new WebsiteSeo({ pageName, title, description, keywords, index });
        const savedSeo = await newSeo.save();

        if (!savedSeo) {
            return serverErrorResponse(res, "Failed to save SEO entry.");
        }

        return successResponse(res, "Website SEO added successfully.", savedSeo);
    } catch (error) {
        console.log("Error in addWebsiteSeo:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

const getAllWebsiteSeo = async (req, res) => {
    try {
        const seoEntries = await WebsiteSeo.find().sort({ createdAt: -1 });

        if (!seoEntries || seoEntries.length === 0) {
            return successResponse(res, "No website SEO entries found.", seoEntries);
        }

        return successResponse(res, "Website SEO entries retrieved successfully.", seoEntries);
    } catch (error) {
        console.log("Error in getAllWebsiteSeo:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

const getWebsiteSeoByPageName = async (req, res) => {
    try {
        const { pageName } = req.query;

        if (!pageName) {
            return badRequestResponse(res, "Page name is required.");
        }

        const seoEntry = await WebsiteSeo.findOne({ pageName });

        if (!seoEntry) {
            return notFoundResponse(res, `No SEO entry found for page: ${pageName}`);
        }

        return successResponse(res, "Website SEO entry retrieved successfully.", seoEntry);
    } catch (error) {
        console.log("Error in getWebsiteSeoByPageName:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

const getOneWebsiteSeo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return badRequestResponse(res, "SEO ID is required.");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid SEO ID format.");
        }

        const seoEntry = await WebsiteSeo.findById(id);

        if (!seoEntry) {
            return notFoundResponse(res, "SEO entry not found.");
        }

        return successResponse(res, "Website SEO entry retrieved successfully.", seoEntry);
    } catch (error) {
        console.log("Error in getOneWebsiteSeo:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

const updateWebsiteSeo = async (req, res) => {
    try {
        const { id } = req.params;
        const { pageName, title, description, keywords, index } = req.body;

        if (!id) {
            return badRequestResponse(res, "SEO ID is required.");
        }

        if (!pageName || !title || !description || !Array.isArray(keywords) || keywords.length === 0) {
            return badRequestResponse(res, "All fields (pageName, title, description, keywords) are required.");
        }

        if (typeof index !== "boolean") {
            return badRequestResponse(res, "Index should be a boolean value.");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid SEO ID format.");
        }

        const seoEntry = await WebsiteSeo.findById(id);

        if (!seoEntry) {
            return notFoundResponse(res, "SEO entry not found.");
        }

        seoEntry.pageName = pageName || seoEntry.pageName;
        seoEntry.title = title || seoEntry.title;
        seoEntry.description = description || seoEntry.description;
        seoEntry.keywords = keywords && Array.isArray(keywords) ? keywords : seoEntry.keywords;
        seoEntry.index = typeof index === "boolean" ? index : seoEntry.index;

        const updatedRecord = await seoEntry.save();

        if (!updatedRecord) {
            return serverErrorResponse(res, "Failed to update SEO entry.");
        }

        return successResponse(res, "Website SEO updated successfully.", seoEntry);
    } catch (error) {
        console.log("Error in updateWebsiteSeo:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

const deleteWebsiteSeo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return badRequestResponse(res, "SEO ID is required.");
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return badRequestResponse(res, "Invalid SEO ID format.");
        }

        const seoEntry = await WebsiteSeo.findByIdAndDelete(id);

        if (!seoEntry) {
            return notFoundResponse(res, "SEO entry not found.");
        }

        return successResponse(res, "Website SEO deleted successfully.");
    } catch (error) {
        console.log("Error in deleteWebsiteSeo:", error);
        return serverErrorResponse(res, "An unexpected issue occurred.");
    }
};

export { addWebsiteSeo, getAllWebsiteSeo, getOneWebsiteSeo, getWebsiteSeoByPageName, updateWebsiteSeo, deleteWebsiteSeo };
