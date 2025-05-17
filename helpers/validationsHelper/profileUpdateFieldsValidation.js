import Joi from "joi";

const profileUpdateFieldsValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(35)
    .required()
    .messages({
      "string.empty": `Name cannot be empty`,
      "string.base": `Name must be a valid string`,
      "string.min": `Name must be at least 2 characters`,
      "string.max": `Name must be at most 35 characters`,
    })
});

export default profileUpdateFieldsValidation;
