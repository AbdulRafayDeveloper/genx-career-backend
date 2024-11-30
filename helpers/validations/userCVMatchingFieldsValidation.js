import Joi from "joi";

const userCVMatchingFieldsValidation = Joi.object({
  file: Joi.object({
    filename: Joi.string().required().messages({
      "string.empty": `File must not be empty`,
    }),
    mimetype: Joi.string()
      .valid("application/pdf")
      .required()
      .messages({
        "any.only": `File must be a PDF`,
        "string.empty": `File must not be empty`,
      }),
    size: Joi.number()
      .max(5 * 1024 * 1024) // 5 MB in bytes
      .required()
      .messages({
        "number.max": `File must be within 5 MB size`,
        "number.base": `Invalid file size`,
      }),
  }).required().messages({
    "object.base": `File must not be empty`,
  }),
});

export default userCVMatchingFieldsValidation;
