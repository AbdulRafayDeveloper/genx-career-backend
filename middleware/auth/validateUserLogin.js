import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import userLoginFieldsValidation from "../../helpers/validationsHelper/userLoginFieldsValidation.js";

const validateUserLogin = async (req, res, next) => {
  try {
    const { error } = await userLoginFieldsValidation.validate(req.body, {
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

export default validateUserLogin;
