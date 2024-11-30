import { badRequestResponse, serverErrorResponse, } from "../helpers/apiResponsesHelpers.js";
import userCVMatchingFieldsValidation from "../helpers/validations/userCVMatchingFieldsValidation.js";

const userCvMatchingValidation = async (req, res, next) => {
  try {
    const { error } = await userCVMatchingFieldsValidation.validate(req.body, {
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

export default userCvMatchingValidation;
