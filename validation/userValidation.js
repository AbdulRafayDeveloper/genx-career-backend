import Joi from "joi";

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    "string.base": `"Name" should be a type of 'text'`,
    "string.empty": `"Name" cannot be an empty field`,
    "string.min": `"Name" should have a minimum length of {#limit}`,
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "string.base": `"Email" should be a type of 'text'`,
      "string.email": `"Email" must be a valid email`,
      "string.empty": `"Email" cannot be an empty field`,
    }),

  password: Joi.string().min(6).required().messages({
    "string.base": `"Password" should be a type of 'text'`,
    "string.empty": `"Password" cannot be an empty field`,
    "string.min": `"Password" should have a minimum length of {#limit}`,
  }),
});

export default userSchema;
