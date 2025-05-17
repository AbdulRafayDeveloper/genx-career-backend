import { badRequestResponse, serverErrorResponse, } from "../../helpers/responsesHelper/apiResponsesHelpers.js";
import passwordUpdateFieldsValidation from "../../helpers/validationsHelper/passwordUpdateFieldsValidation.js";

const validatePasswordUpdate = async (req, res, next) => {
    try {
        console.log("Validating password update fields...");
        console.log("req.body: ", req.body);
        
        const { error } = await passwordUpdateFieldsValidation.validate(req.body, {
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

export default validatePasswordUpdate;
