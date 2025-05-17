import Joi from "joi";

const resetPasswordFieldsValidation = Joi.object({
    password: Joi.string()
        .required()
        .messages({
            "string.base": "Current password must be a string.",
            "string.empty": "Please enter your current password.",
        }),

    newPassword: Joi.string()
        .min(8)
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
        .required()
        .invalid(Joi.ref("password")) // Prevent using the same as current password
        .messages({
            "string.base": "New password must be a string.",
            "string.empty": "Please enter the new password.",
            "string.min": "New password must be at least 8 characters long.",
            "string.pattern.base": "New password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
            "any.invalid": "New password must be different from the current password.",
        }),

    confirmNewPassword: Joi.string()
        .required()
        .valid(Joi.ref("newPassword"))
        .messages({
            "any.only": "New password and confirm password do not match.",
            "string.empty": "Please confirm your new password.",
            "string.base": "Confirm password must be a string.",
        }),
});

export default resetPasswordFieldsValidation;
