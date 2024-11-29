import { badRequestResponse, serverErrorResponse, } from "../helpers/apiResponsesHelpers.js";
import userValidation from "../helpers/validations/usersValidation.js";

const validateUser = async (req, res, next) => {
  try {
    const { error } = await userValidation.validate(req.body, {
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
