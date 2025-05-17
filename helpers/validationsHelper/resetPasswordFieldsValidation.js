import Joi from "joi";

const resetPasswordFieldsValidation = Joi.object({
    newPassword: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
        .required()
        .messages({
            "string.base": "New password must be a string.",
            "string.empty": "Please provide the new password. It cannot be empty.",
            "string.min": "New password must be at least 8 characters long.",
            "string.pattern.base":
                "New password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }),

    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": "Passwords do not match.",
            "string.empty": "Please confirm your password.",
            "string.base": "Confirm password must be a string.",
        }),
});

export default resetPasswordFieldsValidation;
