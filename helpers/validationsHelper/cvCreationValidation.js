// import Joi from "joi";

// const cvSchemaValidation = Joi.object({
//   name: Joi.string().required().messages({
//     "string.empty": "Name is required.",
//     "any.required": "Name is required.",
//   }),
//   summary: Joi.string().required().messages({
//     "string.empty": "Summary is required.",
//     "any.required": "Summary is required.",
//   }),
//   education: Joi.array()
//     .items(
//       Joi.object({
//         degree: Joi.string().required().messages({
//           "string.empty": "Degree is required.",
//           "any.required": "Degree is required.",
//         }),
//         institution: Joi.string().required().messages({
//           "string.empty": "Institute is required.",
//           "any.required": "Institute is required.",
//         }),
//         cgpa: Joi.number().min(0).max(4).required().messages({
//           "number.base": "CGPA must be a number.",
//           "number.min": "CGPA must be at least 0.",
//           "number.max": "CGPA must not exceed 4.0.",
//           "any.required": "CGPA is required.",
//         }),
//         year: Joi.string()
//           .pattern(/^\d{4}-\d{4}$/)
//           .required()
//           .messages({
//             "string.pattern.base": "Year must be in format YYYY-YYYY.",
//             "string.empty": "Year is required.",
//             "any.required": "Year is required.",
//           }),
//       })
//     )
//     .required()
//     .messages({
//       "array.base": "Education must be an array.",
//       "any.required": "Education is required.",
//     }),
//   languages: Joi.array()
//     .items(
//       Joi.object({
//         language: Joi.string().required().messages({
//           "string.empty": "Language is required.",
//           "any.required": "Language is required.",
//         }),
//         proficiency: Joi.string().required().messages({
//           "string.empty": "Proficiency is required.",
//           "any.required": "Proficiency is required.",
//         }),
//       })
//     )
//     .required()
//     .messages({
//       "array.base": "Languages must be an array.",
//       "any.required": "Languages are required.",
//     }),
//   skills: Joi.array()
//     .items(
//       Joi.string().required().messages({
//         "string.empty": "Skill cannot be empty.",
//         "any.required": "Skill is required.",
//       })
//     )
//     .min(1)
//     .required()
//     .messages({
//       "array.min": "At least one skill is required.",
//       "any.required": "Skills are required.",
//     }),
//   experience: Joi.array().optional(),
//   projects: Joi.array().optional(),
//   certificates: Joi.array().optional(),
//   // interests: Joi.array().optional(),
//   interests: Joi.array()
//     .items(Joi.string().max(100))
//     .optional()
//     .messages({
//       "string.max": "Interest should be less than 100 characters.",
//     }),

//   // contact: Joi.object().optional(),
//   contact: Joi.object({
//     email: Joi.string()
//       .email()
//       .required()
//       .messages({
//         "string.email": "Enter a valid email address.",
//         "any.required": "Email is required.",
//       }),
//     phone: Joi.string().optional(),
//     location: Joi.string()
//       .min(3)
//       .max(50)
//       .required()
//       .messages({
//         "string.min": "Location must be at least 3 characters.",
//         "string.max": "Location must be less than 50 characters.",
//         "any.required": "Location is required.",
//       }),
//     linkedin: Joi.string()
//       .uri()
//       .allow("")
//       .max(150)
//       .messages({
//         "string.uri": "Enter a valid LinkedIn URL.",
//         "string.max": "LinkedIn URL must be less than 150 characters.",
//       }),
//     github: Joi.string()
//       .uri()
//       .allow("")
//       .max(150)
//       .messages({
//         "string.uri": "Enter a valid GitHub URL.",
//         "string.max": "GitHub URL must be less than 150 characters.",
//       }),
//   }).required(),

//   imageUrl: Joi.string().optional().messages({
//     "string.uri": "Image URL must be a valid URI.",
//   }),
//   templateName: Joi.string().optional(),
//   color: Joi.string().optional(),
// });

// export default cvSchemaValidation;

import Joi from "joi";

const cvSchemaValidation = Joi.object({
  name: Joi.string().min(2).max(30).required().messages({
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters.",
    "string.max": "Name must be less than 30 characters.",
    "any.required": "Name is required.",
  }),
  summary: Joi.string().min(30).max(400).required().messages({
    "string.empty": "Summary is required.",
    "string.min": "Summary must be at least 30 characters.",
    "string.max": "Summary must be less than 400 characters.",
    "any.required": "Summary is required.",
  }),
  education: Joi.array()
    .items(
      Joi.object({
        degree: Joi.string().min(2).max(100).required(),
        institution: Joi.string().min(2).max(100).required(),
        cgpa: Joi.number().min(0).max(4).required(),
        year: Joi.string()
          .pattern(/^\d{4}-\d{4}$/)
          .required()
          .messages({
            "string.pattern.base": "Year must be in format YYYY-YYYY.",
          }),
      })
    )
    .required(),
  languages: Joi.array()
    .items(
      Joi.object({
        language: Joi.string().min(2).max(20).required(),
        proficiency: Joi.string().required(),
      })
    )
    .required(),
  skills: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required(),
  experience: Joi.array()
    .items(
      Joi.object({
        title: Joi.string().min(2).max(30).allow(""),
        company: Joi.string().min(2).max(50).allow(""),
        description: Joi.string().min(10).max(400).allow(""),
      })
    )
    .optional(),
  projects: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().min(2).max(50).allow(""),
        technologies: Joi.array().items(Joi.string().min(1)).min(1).optional(),
        link: Joi.string()
          .pattern(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/)
          .allow("")
          .messages({
            "string.pattern.base": "Enter a valid project URL.",
          }),
      })
    )
    .optional(),
  certificates: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().allow(""),
        date: Joi.string().allow(""),
      })
    )
    .optional(),
  interests: Joi.array().items(Joi.string().max(100)).optional(),
  contact: Joi.object({
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    location: Joi.string().min(3).max(50).required(),
    linkedin: Joi.string()
      .pattern(/^(https?:\/\/)?([\w]+\.)?linkedin\.com\/.*$/i)
      .allow("")
      .max(150),
    github: Joi.string()
      .pattern(/^https?:\/\/(www\.)?github\.com\/.+/)
      .allow("")
      .max(150),
  }).required(),
  imageUrl: Joi.string()
    .uri()
    .when("templateName", {
      is: Joi.valid("template1", "template3"),
      then: Joi.required().messages({
        "any.required": "Image URL is required for this template.",
      }),
      otherwise: Joi.optional(),
    }),
  templateName: Joi.string().optional(),
  color: Joi.string().optional(),
});

export default cvSchemaValidation;
