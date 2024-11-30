import Joi from "joi";

const userLoginFieldsValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": `Please provide the email. The email cannot be empty`,
      "string.email": `Please provide an email that must be in a valid format`,
      "string.base": `Email must be in a string format`,
    }),

  password: Joi.string()
    .min(8)
    .required()
    .messages({
      "string.empty": `Password must not be empty`,
      "string.base": `Password must be in the form of a string`,
      "string.min": `Password must have at least 8 characters`,
    }),

  confirmPassword: Joi.string()
    .min(8)
    .required()
    .valid(Joi.ref("password"))
    .messages({
      "string.empty": `Confirm password must not be empty`,
      "string.base": `Confirm password must be in the form of a string`,
      "string.min": `Confirm password must have at least 8 characters`,
      "any.only": `Password and confirm password must match`,
    }),
});

export default userLoginFieldsValidation;
