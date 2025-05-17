import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import profileUpdateFieldsValidation from "../../helpers/validationsHelper/profileUpdateFieldsValidation.js";

const validateProfileUpdate = async (req, res, next) => {
    try {
        console.log("Validating profile update fields...");
        console.log("Request body:", req);
        console.log("Request params:", req.params);


        const { error } = await profileUpdateFieldsValidation.validate(req.body, {
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

export default validateProfileUpdate;
