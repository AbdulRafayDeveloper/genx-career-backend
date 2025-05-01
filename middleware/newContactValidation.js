import { badRequestResponse, serverErrorResponse, } from "../helpers/responsesHelper/apiResponsesHelpers.js";
import newContactFieldsValidation from "../helpers/validationsHelper/newContactFieldsValidation.js";

const newContactValidation = async (req, res, next) => {
  try {
    const { error } = await newContactFieldsValidation.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return badRequestResponse(res, `Validation Error ${errorMessages}`, null);
    }

    next();
  } catch (err) {
    return serverErrorResponse(res, "Internal Server Error");
  }
};

export default newContactValidation;
