import Joi from "joi";

const userRegisterFieldsValidation = Joi.object({
  name: Joi.string().min(2).max(35).required().messages({
    "string.empty": `Please provide the name. The name cannot be empty`,
    "string.base": `Name only contains characters `,
    "string.min": `Name must be Correct`,
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": `Please provide the email. The email cannot be empty`,
      "string.email": `Please provide email that must be in a valid Format`,
      "string.base": `Email must be in a String Format`,
    }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.base": `Password must be in the form of a string`,
      "string.empty": `Please provide the password. The password cannot be empty`,
      "string.min": `Password must have at least 8 characters`,
      "string.pattern.base": `Password must include at least one uppercase letter, one lowercase letter, one number, and one special character`,
    }),
});

export default userRegisterFieldsValidation;
