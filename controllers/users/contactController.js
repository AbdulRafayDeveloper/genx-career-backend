import { findContactByEmail, createContact, getContactById, deleteContact, countContacts, listContacts, updateContactMessages } from "../../services/contactServices.js";
import { badRequestResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from "../../helpers/apiResponsesHelpers.js";
import mongoose from "mongoose";

const createNewContact = async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    if (!email || !subject || !message) {
      return badRequestResponse(res, "All fields are mandatory", null);
    }

    const existingContact = await findContactByEmail({ email });

    if (existingContact) {
      const updateContact = await updateContactMessages(email, message);

      if (updateContact) {
        return successResponse(res, "You message send successfully", updateContact);
      } else {
        return serverErrorResponse(res, "Failed to send your message");
      }

    } else {

      const contact = await createContact({
        email,
        subject,
        messages: [{ message }],
      });

      if (contact) {
        return successResponse(res, "Message has been deleivered succcessfully", contact);
      } else {
        return serverErrorResponse(res, "Error while sending message");
      }
    }
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server error Please try again later");
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

    const contact = await getContactById(id);

    if (!contact) {
      return notFoundResponse(res, "Record not found in the database", null);
    }

    return successResponse(res, "Record fetched successfully", contact);
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
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

    const totalRecords = await countContacts(query);

    if (!totalRecords) {
      return notFoundResponse(res, "No contacts found.", null);
    }

    const totalPages = Math.ceil(totalRecords / pageSize);
    const skip = (page - 1) * pageSize;
    const contacts = await listContacts(query, skip, pageSize);

    if (!contacts || contacts.length === 0) {
      return notFoundResponse(res, "No contacts found for the given page.", null);
    }

    return successResponse(res, "Contacts fetched successfully.", {
      records: contacts, pagination: { totalRecords, totalPages, currentPage: page, pageSize, },
    });
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later!");
  }
};

const deleteOneContact = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return unauthorizedResponse(res, "Id not provided", null);
    }

    const contact = await getContactById(id);

    if (!contact) {
      return notFoundResponse(res, "No Contact found", null);
    }

    const contactDelete = await deleteContact(contact);

    if (contactDelete) {
      return successResponse(res, "Contact deleted successfully", contactDelete);
    } else {
      return serverErrorResponse(res, "Unable to delete contact. Please try again later");
    }
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

export { createNewContact, getOneContact, getAllContacts, deleteOneContact };
