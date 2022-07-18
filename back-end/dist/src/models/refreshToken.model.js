"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
const RefreshTokenSchema = new mongoose_2.Schema({
    user: { type: mongoose_2.Schema.Types.ObjectId, ref: 'Users' },
    token: String,
    created: { type: Date, default: Date.now },
    createdByIp: String,
});
RefreshTokenSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.id;
        delete ret.user;
    },
});
module.exports = mongoose_1.default.model('RefreshToken', RefreshTokenSchema);
