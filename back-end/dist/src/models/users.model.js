"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const joi_1 = __importDefault(require("joi"));
const UsersSchema = new mongoose_2.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        required: false,
        default: false
    },
    birth_day: {
        type: Date,
        required: false,
    },
    gender: {
        type: Boolean,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    avatar: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    room_list: {
        type: Array,
        required: false,
    },
});
const registerSchema = joi_1.default.object({
    username: joi_1.default.string()
        .min(8)
        .max(32)
        .pattern(new RegExp('^[a-zA-Z0-9_-]+$'))
        .required(),
    password: joi_1.default.string()
        .min(8)
        .max(16)
        .pattern(new RegExp('^[a-zA-Z0-9_-]+$'))
        .required(),
    fullName: joi_1.default.string()
        .min(8)
        .max(50)
        .pattern(new RegExp('^[a-zA-Z0-9_-]+$'))
        .required(),
    email: joi_1.default.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
});
module.exports = { Users: mongoose_1.default.model('user', UsersSchema), registerSchema };
