import { successResponse, badRequestResponse, notFoundResponse, serverErrorResponse, unauthorizedResponse } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verifyAdminToken = async (req, res, next) => {
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

const verifyUserToken = async (req, res, next) => {
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

    if (req.user.role !== "user") {
      return unauthorizedResponse(res, "Access denied. User role required.", null);
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

const restrictAdminUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("authHeader:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return badRequestResponse(res, "Authentication token is required", null);
  }

  const token = authHeader.split(" ")[1];

  console.log("token:", token);

  if (!token) {
    return notFoundResponse(res, "Authentication token is not provided", null);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { _id: decoded.id, role: decoded.role };

    console.log("req.user.role 1:", req.user.role);

    if (req.user.role !== "admin" && req.user.role !== "user") {
      return unauthorizedResponse(res, "Access denied. Admin or User role required.", null);
    }

    console.log("req.user.role 2:", req.user.role);

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

const verifyOtpToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return badRequestResponse(res, "Authentication token is required", null);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return notFoundResponse(res, "Authentication token is not provided", null);
  }

  try {
    const decoded = jwt.verify(token, process.env.FORGET_PASSWORD_TOKEN);
    console.log("decoded:", decoded);
    const { email, otp } = decoded;
    console.log("email:", email);
    console.log("otp:", otp);
    if (!email || !otp) {
      return badRequestResponse(res, "Invalid token data", null);
    }
    req.otpData = decoded;
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

const verifyEmailToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return badRequestResponse(res, "Authentication token is required", null);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return notFoundResponse(res, "Authentication token is not provided", null);
  }

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN);
    req.email = decoded.email;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return unauthorizedResponse(res, "Expired token, log in again", null);
    } else if (error.name === "JsonWebTokenError") {
      return unauthorizedResponse(res, "Invalid token. Please try again", null);
    } else {
      return serverErrorResponse(res, "An unexpected error occurred", error.message);
    }
  }
};

export { verifyAdminToken, verifyUserToken, restrictAdminUser, verifyOtpToken, verifyEmailToken };
