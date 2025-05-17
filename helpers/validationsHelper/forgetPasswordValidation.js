import Joi from "joi";

const forgetPasswordValidation = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            "string.empty": `Please provide the email. The email cannot be empty`,
            "string.email": `Please provide an email that must be in a valid format`,
            "string.base": `Email must be in a string format`,
        })
});

export default forgetPasswordValidation;
