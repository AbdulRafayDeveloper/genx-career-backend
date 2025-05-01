import Joi from "joi";

const newContactFieldsValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(35)
    .required()
    .messages({
      "string.empty": `Name cannot be empty`,
      "string.base": `Name must be a valid string`,
      "string.min": `Name must be at least 2 characters`,
      "string.max": `Name must be at most 35 characters`,
    }),

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
