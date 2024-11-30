import Joi from "joi";

const newContactFieldsValidation = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": `Email cannot be empty`,
      "string.email": `Email must have the correct format`,
      "string.base": `Email must be a valid string`,
    }),

  message: Joi.string()
    .max(200)
    .required()
    .messages({
      "string.empty": `Message must not be empty`,
      "string.max": `Message must be within 200 words`,
      "string.base": `Message must be a valid string`,
    }),
});

export default newContactFieldsValidation;
