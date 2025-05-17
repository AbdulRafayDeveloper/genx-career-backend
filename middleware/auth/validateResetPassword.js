import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import resetPasswordFieldsValidation from "../../helpers/validationsHelper/resetPasswordFieldsValidation.js";

const validateResetPassword = async (req, res, next) => {
    try {
        const { error } = await resetPasswordFieldsValidation.validate(req.body, {
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

export default validateResetPassword;
