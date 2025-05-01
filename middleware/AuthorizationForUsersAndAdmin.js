import { badRequestResponse, notFoundResponse, serverErrorResponse, unauthorizedResponse } from "../helpers/responsesHelper/apiResponsesHelpers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateLoginToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return badRequestResponse(res, "Authentication token is required", null);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return notFoundResponse(res, "Authentication token is not provided", null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { _id: decoded.id, role: decoded.role };

    if (req.user.role !== "admin") {
      return unauthorizedResponse(res, "Access denied. Admin role required.", null);
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return unauthorizedResponse(res, "Expired token, log in again");
    } else if (error.name === "JsonWebTokenError") {
      return unauthorizedResponse(res, "Invalid token, log in again");
    } else {
      return serverErrorResponse(res, "An unexpected error occurred");
    }
  }
};

const userAuthenticateLoginToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return badRequestResponse(res, "Authentication token is required", null);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return notFoundResponse(res, "Authentication token is not provided", null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { _id: decoded.id, role: decoded.role };

    if (req.user.role == "admin" || req.user.role == "user") {
      return unauthorizedResponse(res, "Access denied. Admin or User role required.", null);
    }

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return unauthorizedResponse(res, "Expired token, log in again");
    } else if (error.name === "JsonWebTokenError") {
      return unauthorizedResponse(res, "Invalid token, log in again");
    } else {
      return serverErrorResponse(res, "An unexpected error occurred");
    }
  }
};

export { authenticateLoginToken, userAuthenticateLoginToken };
