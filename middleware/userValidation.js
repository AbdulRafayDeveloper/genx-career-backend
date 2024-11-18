import userSchema from "../validation/userValidation.js";
import {
  badRequestResponse,
  serverErrorResponse,
} from "../helpers/apiResponses.js";

const validateUser = async (req, res, next) => {
  try {
    const { error } = await userSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return badRequestResponse(res, "Validation Error", errorMessages);
    }

    next();
  } catch (err) {
    return serverErrorResponse(res, "Internal Server Error");
  }
};

export default validateUser;
