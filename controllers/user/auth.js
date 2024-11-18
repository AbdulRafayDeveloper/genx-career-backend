import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  unauthorizedResponse,
  serverErrorResponse,
  conflictResponse,
} from "../../helpers/apiResponses.js";
import {
  findUser,
  findOneUser,
  createUser,
} from "../../services/userServices.js";

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
      return successResponse(res, "User is successfully created", newUser);
    } else {
      return serverErrorResponse(res, "Failed to create user");
    }
  } catch (error) {
    return serverErrorResponse(
      res,
      "Internal server error. Please try again later"
    );
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return badRequestResponse(res, "All fields are mandatory", null);
    }
    const user = await findOneUser({ email });

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (user && passwordCheck && user.role === "user") {
      const userLoginToken = jwt.sign(
        {
          id: user._id,
        },
        process.env.USER_LOGIN_TOKEN,
        { expiresIn: "1d" }
      );
      return successResponse(
        res,
        "User has logged in successfully",
        userLoginToken
      );
    } else if (user && passwordCheck && user.role === "admin") {
      const adminLoginToken = jwt.sign(
        {
          id: user._id,
          role: user.role,
        },
        process.env.ADMIN_LOGIN_TOKEN,
        { expiresIn: "1d" }
      );
      return successResponse(
        res,
        "Admin has logged in successfully",
        adminLoginToken
      );
    } else {
      return notFoundResponse(res, "User credentials are not correct", null);
    }
  } catch (error) {
    console.log(error);
    return serverErrorResponse(
      res,
      "Internal Server Error.Please try again later"
    );
  }
};
export { registerUser, loginUser };
