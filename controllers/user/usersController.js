import {
  getUserById,
  deleteUser,
  countUsers,
  listUsers,
} from "../../services/userServices.js";
import {
  badRequestResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../../helpers/apiResponses.js";
import mongoose from "mongoose";

const getAllUsersController = async (req, res) => {
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

    const totalRecords = await countUsers(query);

    if (!totalRecords) {
      return notFoundResponse(res, "No users found.", null);
    }

    const totalPages = Math.ceil(totalRecords / pageSize);
    const skip = (page - 1) * pageSize;
    const users = await listUsers(query, skip, pageSize);

    if (!users || users.length === 0) {
      return notFoundResponse(res, "No users found for the given page.", null);
    }

    return successResponse(res, "Users fetched successfully.", {
      records: users, pagination: { totalRecords, totalPages, currentPage: page, pageSize, },
    });
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later!");
  }
};

const getOneUserController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const user = await getUserById(id);

    if (!user) {
      return notFoundResponse(res, "Record not found in the database", null);
    }

    return successResponse(res, "Record fetched successfully", user);
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later.");
  }
};

const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return unauthorizedResponse(res, "Id not provided", null);
    }

    const user = await getUserById(id);

    if (!user) {
      return notFoundResponse(res, "The user is not found!", null);
    }

    const userDelete = await deleteUser(user);

    if (userDelete) {
      return successResponse(res, "User deleted successfully", userDelete);
    } else {
      return serverErrorResponse(res, "Unable to delete user. Please try again later");
    }
  } catch (error) {
    console.error("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

export { getAllUsersController, getOneUserController, deleteUserController };
