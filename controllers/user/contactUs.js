import {
  findContactByEmail,
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  countContacts,
  listContacts,
  updateContactMessages,
} from "../../services/contactUsServices.js";

import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../../helpers/apiResponses.js";

const createContactController = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return badRequestResponse(res, "All fields are mandatory", null);
    }
    const existingContact = await findContactByEmail({ email });
    if (existingContact) {
      const updateContact = await updateContactMessages(email, message);
      if (updateContact) {
        return successResponse(
          res,
          "Another message added successfully",
          updateContact
        );
      } else {
        return serverErrorResponse(res, "Failed to add another message");
      }
    } else {
      const contact = await createContact({
        name,
        email,
        messages: [{ message }],
      });
      if (contact) {
        return successResponse(
          res,
          "Message has been deleivered succcessfully",
          contact
        );
      } else {
        return serverErrorResponse(res, "Error while sending message");
      }
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal Server error Please try again later"
    );
  }
};

const deleteContactController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return unauthorizedResponse(
        res,
        "The user is not authorized for this action",
        null
      );
    }
    const id = req.params.id;
    const contact = await getContactById(id);
    if (!contact) {
      return notFoundResponse(res, "No Contact found", null);
    }
    const contactDelete = await deleteContact(contact);
    if (contactDelete) {
      return successResponse(
        res,
        "Contact deleted successfully",
        contactDelete
      );
    } else {
      return serverErrorResponse(
        res,
        "Unable to delete contact. Please try again later"
      );
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal Server Error. Please try again later"
    );
  }
};

const getOneContactController = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return unauthorizedResponse(
        res,
        "The user is not authorized for this action",
        null
      );
    }
    const id = req.params.id;
    const contact = await getContactById(id);
    if (contact) {
      return successResponse(res, "Contact fetched successfully", contact);
    } else {
      return notFoundResponse(res, "Contact not found", null);
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error. Please try again later"
    );
  }
};

const getAllContactsController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";

    let query = {};
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
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
      return notFoundResponse(
        res,
        "No contacts found for the given page.",
        null
      );
    }
    return successResponse(res, "Contacts fetched successfully.", {
      records: contacts,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize,
      },
    });
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal Server Error. Please try again later!"
    );
  }
};

export {
  createContactController,
  deleteContactController,
  getOneContactController,
  getAllContactsController,
};
