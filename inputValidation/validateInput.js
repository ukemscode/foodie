const Joi = require("joi");

function validateProfile(input) {
  const schema = Joi.object({
    fullName: Joi.string().optional(),
    profilePicture: Joi.string().optional(),
    gender: Joi.string()
      .valid("male", "female")
      .messages({ "any.only": 'Gender should be "male" or "female".' }),
    DOB: Joi.date().optional(),
    previledgeType: Joi.string().valid("Admin", "User").messages({
      "any.only": 'Privilege type can only be "Admin" or "User".',
    }),
  });

  return schema.validate(input.body).error;
}

function validateUser(input) {
  const schema = joi.object({
    username: joi.string().min(3).required(),
    email: joi.string().email().required(),
    phoneNumber: joi.string().max(11).required(),
    password: joi.string().min(5).required(),
  });

  return schema.validate(input.body).error;
}

function validateUpdatedUser(input) {
  const schema = Joi.object({
    username: Joi.string().min(3),
    email: Joi.string().email(),
    phoneNumber: Joi.string().max(11),
  });

  return schema.validate(input.body).error;
}

function validateLogin(input) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
  });

  return schema.validate(input.body).error;
}

function validatePassword(input) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string()
      .min(5)
      .valid("change", "forgotten")
      .messages({ "any.only": 'Gender should be "change" or "forgotten".' })
      .required(),
  }).unknown();
  const error = schema.validate(input.body).error;
  if (error) return error;

  if (input.body.type === "change") {
    const schema = Joi.object({
      oldPassword: Joi.string().min(5).required(),
      newPassword: Joi.string().min(5).required(),
    });
    return schema.validate(input.body.content).error;
  }
}

module.exports = {
  validateProfile,
  validateUser,
  validateUpdatedUser,
  validateLogin,
  validatePassword,
};
