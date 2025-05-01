import { badRequestResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import sendEmail from "../../helpers/emailHelpers/emailHelper.js";
import generateThankYouTemplate from "../../helpers/emailHelpers/thankYouTemplate.js";
import contactsModel from "../../models/contactsModel.js";
import mongoose from "mongoose";
import XLSX from "xlsx";

const createNewContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return badRequestResponse(res, "All fields are mandatory", null);
    }
    const contact = new contactsModel({ name, email, message });
    const newContact = await contact.save();

    if (newContact) {
      await sendEmail(email, "Thanks for Contacting Us!", generateThankYouTemplate());
      return successResponse(res, "Message has been delivered successfully", newContact);
    } else {
      return serverErrorResponse(res, "Error while sending message");
    }
  } catch (error) {
    return serverErrorResponse(error, "Internal Server Error. Please try again later.");
  }
};

const getOneContact = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const contact = await contactsModel.findById(id);

    if (!contact) {
      return notFoundResponse(res, "Record not found in the database", null);
    }

    return successResponse(res, "Record fetched successfully", contact);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

const getAllContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    let query = {};

    if (searchQuery) {
      query.$or = [
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalRecords = await contactsModel.countDocuments(query);

    if (!totalRecords) {
      return notFoundResponse(res, "No contacts found.", null);
    }

    const totalPages = Math.ceil(totalRecords / pageSize);
    const skip = (page - 1) * pageSize;
    const contacts = await contactsModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    if (!contacts || contacts.length === 0) {
      return notFoundResponse(res, "No contacts found for the given page.", null);
    }

    return successResponse(res, "Contacts fetched successfully.", {
      records: contacts, pagination: { totalRecords, totalPages, currentPage: page, pageSize, },
    });
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later!");
  }
};

const deleteOneContact = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return unauthorizedResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const contact = await contactsModel.findById(id);

    if (!contact) {
      return notFoundResponse(res, "No Contact found", null);
    }

    const contactDelete = await contactsModel.findByIdAndDelete(id);

    if (!contactDelete) {
      return serverErrorResponse(res, "Unable to delete contact. Please try again later");
    }

    return successResponse(res, "Contact deleted successfully", contactDelete);
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

const exportContactsToExcel = async (req, res) => {
  try {
    const contacts = await contactsModel.find({});

    if (!contacts.length) {
      return successResponse(res, "No contacts found to export.", []);
    }

    const contactsData = contacts.map((contactUser) => ({
      Name: contactUser.name || "N/A",
      Email: contactUser.email || "N/A",
      Message: contactUser.message || "N/A",
    }));

    const worksheet = XLSX.utils.json_to_sheet(contactsData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const buffer = Buffer.from(excelBuffer, "binary");
    res.setHeader("Content-Disposition", "attachment; filename=UsersQueries_List.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.send(buffer);
  } catch (error) {
    console.log("Error exporting contacts to Excel:", error.message);
    return serverErrorResponse(res, "Failed to export contacts to Excel. Please try again later.");
  }
};

export { createNewContact, getOneContact, getAllContacts, deleteOneContact, exportContactsToExcel };
