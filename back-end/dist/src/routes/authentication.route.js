"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const Joi = require('joi');
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const validator = require('express-joi-validation').createValidator({
    passError: true,
});
const { Auth } = require("../controllers/authentication.controller");
const { registerSchema } = require("../models/users.model");
const authentication = new Auth();
router.post('/register', validator.body(registerSchema), authentication.register);
router.get("/activate_account/:name", authentication.activateAccount);
router.post("/sign-in", authentication.signIn);
//The following apis are used for forgot password
router.post('/forgot-password', authentication.getUserByEmail);
router.post('/create-code', authentication.createCodeExpire);
router.post('/check-code', authentication.checkForgotPasswordCode);
router.post('/reset-password', authentication.resetPassword);
router.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        // we had a joi error, let's return a custom 400 json response
        res.status(400).json({
            type: err.type,
            message: err.error.toString(),
        });
    }
    else {
        // pass on to another error handler
        next(err);
    }
});
exports.default = router;
