const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Joi = require("joi");
const _CONF = require("../configs/auth.config");

const UsersSchema = Schema({

    username:{
        type: String,
        required: true,
    },

    password:{
        type: String,
        required: true,
    },

    full_name: {
        type: String,
        required: true,
    },

    email:{
        type: String,
        required: true,
    },

    active:{
        type: Boolean,
        required: false,
        default: false
    },

    birth_day:{
        type: Date,
        required: false,
    },

    gender: {
        type: Boolean,
        required: false,
    },

    phone:{
        type: String,
        required: false,
    },

    avatar:{
        type: String,
        required: false,
    },

    description:{
      type: String,
      required: false,
    },

    room_list: {
      type: Array,
      required: false,
    },

});

const registerSchema = Joi.object({
  username: Joi.string()
    .min(8)
    .max(32)
    .pattern(new RegExp(_CONF.REGEX_USENAME_PASSWORD))
    .required(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(new RegExp(_CONF.REGEX_USENAME_PASSWORD))
    .required(),
  fullName: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp(_CONF.REGEX_FULLNAME))
    .required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

const signInSchema = Joi.object({
    username: Joi.string()
      .min(8)
      .max(32)
      .pattern(new RegExp(_CONF.REGEX_USENAME_PASSWORD))
      .required(),
    password: Joi.string()
      .min(8)
      .max(16)
      .pattern(new RegExp(_CONF.REGEX_USENAME_PASSWORD))
      .required(),
  });

module.exports = {Users: mongoose.model("user", UsersSchema), registerSchema, signInSchema};


