import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import userRegisterFieldsValidation from "../../helpers/validationsHelper/userRegisterFieldsValidation.js";

const validateUserRegistration = async (req, res, next) => {
  try {
    const { error } = await userRegisterFieldsValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return badRequestResponse(res, `Validation Error: ${errorMessages}`, null);
    }

    next();
  } catch (err) {
    return serverErrorResponse(res, "Internal Server Error");
  }
};

export default validateUserRegistration;
