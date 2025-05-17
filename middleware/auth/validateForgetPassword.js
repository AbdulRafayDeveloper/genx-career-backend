import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import forgetPasswordValidation from "../../helpers/validationsHelper/forgetPasswordValidation.js";

const validateForgetPassword = async (req, res, next) => {
    try {
        const { error } = await forgetPasswordValidation.validate(req.body, {
            abortEarly: true,
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

export default validateForgetPassword;
