import { badRequestResponse, serverErrorResponse, } from "../helpers/apiResponsesHelpers.js";
import userRegisterFieldsValidation from "../helpers/validations/userRegisterFieldsValidation.js";

const userRegisterValidation = async (req, res, next) => {
  try {
    const { error } = await userRegisterFieldsValidation.validate(req.body, {
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

export default userRegisterValidation;
