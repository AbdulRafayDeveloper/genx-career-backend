import Joi from "joi";

const cvSchemaValidation = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required.",
    "any.required": "Name is required.",
  }),
  summary: Joi.string().required().messages({
    "string.empty": "Summary is required.",
    "any.required": "Summary is required.",
  }),
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().required().messages({
          "string.empty": "Degree is required.",
          "any.required": "Degree is required.",
        }),
        institute: Joi.string().required().messages({
          "string.empty": "Institute is required.",
          "any.required": "Institute is required.",
        }),
        cgpa: Joi.number().min(0).max(4).required().messages({
          "number.base": "CGPA must be a number.",
          "number.min": "CGPA must be at least 0.",
          "number.max": "CGPA must not exceed 4.0.",
          "any.required": "CGPA is required.",
        }),
        year: Joi.string()
          .pattern(/^\d{4}-\d{4}$/)
          .required()
          .messages({
            "string.pattern.base": "Year must be in format YYYY-YYYY.",
            "string.empty": "Year is required.",
            "any.required": "Year is required.",
          }),
      })
    )
    .required()
    .messages({
      "array.base": "Education must be an array.",
      "any.required": "Education is required.",
    }),
  languages: Joi.array()
    .items(
      Joi.object({
        language: Joi.string().required().messages({
          "string.empty": "Language is required.",
          "any.required": "Language is required.",
        }),
        proficiency: Joi.string().required().messages({
          "string.empty": "Proficiency is required.",
          "any.required": "Proficiency is required.",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Languages must be an array.",
      "any.required": "Languages are required.",
    }),
  skills: Joi.array()
    .items(
      Joi.string().required().messages({
        "string.empty": "Skill cannot be empty.",
        "any.required": "Skill is required.",
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one skill is required.",
      "any.required": "Skills are required.",
    }),
  experience: Joi.array().optional(),
  projects: Joi.array().optional(),
  certificates: Joi.array().optional(),
  interests: Joi.array().optional(),
  contact: Joi.object().optional(),
  imageUrl: Joi.string().optional().messages({
    "string.uri": "Image URL must be a valid URI.",
  }),
  templateName: Joi.string().optional(),
  color: Joi.string().optional(),
});

export default cvSchemaValidation;
