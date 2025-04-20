import { successResponse, badRequestResponse, notFoundResponse, serverErrorResponse, conflictResponse, } from "../../helpers/apiResponsesHelpers.js";
import { findUser, findOneUser, createUser } from "../../services/userServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return badRequestResponse(res, "Please provide all fields", null);
    }

    const user = await findUser({ email });

    if (user) {
      return conflictResponse(res, "User with this email already exists", null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      return successResponse(res, "User account created successfully", newUser);
    } else {
      return serverErrorResponse(res, "Failed to create user");
    }

  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal server error. Please try again later");
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return badRequestResponse(res, "All fields are mandatory", null);
    }

    const user = await findOneUser({ email });

    if (!user) {
      return notFoundResponse(res, "This Account is not registered.", null);
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (user && passwordCheck) {
      const userLoginToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1d" }
      );

      return successResponse(res, "User has logged in successfully", { token: userLoginToken, user: user });
    } else {
      return notFoundResponse(res, "User credentials are not correct", null);
    }
  } catch (error) {
    console.log("Error Message in Catch BLock:", error.message);
    return serverErrorResponse(res, "Internal Server Error.Please try again later");
  }
};

export { registerUser, loginUser };
