import cvMatchersModel from "../../models/cvMatchersModel.js";
import usersModel from "../../models/usersModel.js";
import { badRequestResponse, notFoundResponse, serverErrorResponse, successResponse, unauthorizedResponse } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import XLSX from "xlsx";
import Users from "../../models/usersModel.js";

const getAllUsersController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 10;
    const searchQuery = req.query.search || "";
    let query = { role: "user" };

    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalRecords = await Users.countDocuments(query);

    if (!totalRecords) {
      return notFoundResponse(res, "No users found.", null);
    }

    const totalPages = Math.ceil(totalRecords / pageSize);
    const skip = (page - 1) * pageSize;
    const users = await Users.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize);

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
    console.log("getOneUserController");
    const id = req.params.id;

    if (!id) {
      return notFoundResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const user = await Users.findById(id);

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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const user = await Users.findById(id);

    if (!user) {
      return notFoundResponse(res, "The user is not found!", null);
    }

    const userDelete = await Users.findByIdAndDelete(id);

    if (!userDelete) {
      return serverErrorResponse(res, "Unable to delete user. Please try again later");
    }

    const deleteCvMatcher = await cvMatchersModel.findOneAndDelete({ userId: user._id });

    if (!deleteCvMatcher) {
      console.log("No CvMatcher found for this user.");
    }

    return successResponse(res, "User deleted successfully", userDelete);
  } catch (error) {
    console.error("Error in Catch Block:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

const exportUsersToExcel = async (req, res) => {
  try {
    console.log("exportUsersToExcel");
    const users = await usersModel.find({});

    if (!users.length) {
      return successResponse(res, "No users found to export.", []);
    }

    const usersData = users.map((user) => ({
      Name: user.name || "N/A",
      Email: user.email || "N/A",
      RegisterDate: user.createdAt ? user.createdAt.toISOString().split("T")[0] : "N/A"
    }));

    const worksheet = XLSX.utils.json_to_sheet(usersData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    const buffer = Buffer.from(excelBuffer, "binary");
    res.setHeader("Content-Disposition", "attachment; filename=Users_List.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    res.send(buffer);
  } catch (error) {
    console.error("Error exporting contacts to Excel:", error.message);
    return serverErrorResponse(res, "Failed to export contacts to Excel. Please try again later.");
  }
};

const userProfileUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { name } = req.body;

    if (!name) {
      return badRequestResponse(res, "Name is required field", null);
    }

    if (!id) {
      return unauthorizedResponse(res, "Id not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const user = await Users.findById(id);

    if (!user) {
      return notFoundResponse(res, "The user is not found!", null);
    }

    user.name = name;
    const updatedUser = await user.save();

    if (!updatedUser) {
      return serverErrorResponse(res, "Unable to update user profile. Please try again later");
    }

    return successResponse(res, "User profile updated successfully", updatedUser);
  } catch (error) {
    console.error("Error in Catch Block:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

const userPasswordUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { password, newPassword } = req.body;

    if (!password || !newPassword) {
      return badRequestResponse(res, "Current password and new password are required", null);
    }

    if (!id) {
      return unauthorizedResponse(res, "User ID not provided", null);
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return badRequestResponse(res, "Invalid ID format", null);
    }

    const user = await Users.findById(id);

    if (!user) {
      return notFoundResponse(res, "User not found", null);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return unauthorizedResponse(res, "Current password is incorrect", null);
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await Users.findByIdAndUpdate(id, { password: hashedNewPassword });

    if (!updatedUser) {
      return serverErrorResponse(res, "Failed to update password", null);
    }

    return successResponse(res, "Password updated successfully", updatedUser);
  } catch (error) {
    console.error("Error in userPasswordUpdate:", error.message);
    return serverErrorResponse(res, "Internal Server Error. Please try again later");
  }
};

export { getAllUsersController, getOneUserController, deleteUserController, exportUsersToExcel, userProfileUpdate, userPasswordUpdate };
