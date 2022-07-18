"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const Helper_utils_1 = require("../utils/Helper.utils");
const UsersService = require("../services/users.service");
const { Email } = require("../utils/Mail.utils");
class Auth {
    constructor() {
        this.validateSignup = (data) => __awaiter(this, void 0, void 0, function* () {
            const checkUsername = yield UsersService.find({ username: data.username });
            if (checkUsername.length > 0) {
                return { success: false, error: 'Username already exist' };
            }
            const checkEmail = yield UsersService.find({ email: data.email });
            if (checkEmail.length > 0) {
                return { success: false, error: 'Email already exist' };
            }
            return { success: true };
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                username: req.body.username,
                email: req.body.email,
                fullName: req.body.fullName,
                password: req.body.password,
            };
            try {
                const validateResult = yield this.validateSignup(data);
                if (!validateResult.success) {
                    res.json(validateResult.error);
                }
                else {
                    const user = yield UsersService.create(data);
                    const emailAgent = new Email();
                    emailAgent.sendEmail(user.email, user.username);
                    res.json('Create account success');
                }
            }
            catch (error) {
                res.status(500).json({ error: error });
            }
        });
        this.activateAccount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const activateResult = yield UsersService.activateAccount(req.params.name);
                res.json(activateResult);
            }
            catch (err) {
                console.log(err);
            }
        });
        this.signIn = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    username: req.body.username,
                    password: req.body.password,
                    ipAddress: req.ip,
                };
                console.log(data);
                const response = yield UsersService.authenticate(data);
                console.log(response);
                console.log(response.accessToken);
                // this.setTokenCookie(res, response.accessToken);
                res.cookie("access_token", response.accessToken, {
                    maxAge: 5 * 60,
                    httpOnly: true,
                });
                res.status(200).json(response);
            }
            catch (error) {
                if (error === 'Username or password is incorrect') {
                    res.status(403).json({ status: '403', error: error });
                }
                else {
                    res.status(404).json({ status: '404', error: 'Invalid request' });
                }
            }
        });
        this.getUserByEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email: req.body.email,
                };
                console.log(data);
                const response = yield UsersService.find(data);
                //It returns an array, if response find success, user
                //is the first elements in array
                const user = response[0];
                if (user) {
                    if (!user.active) {
                        res.status(404).json({
                            success: false,
                            // status: '404', 
                            error: {
                                code: 'FORGOT_PASSWORD_004',
                                message: 'Your account is not verified',
                            }
                        });
                    }
                    else {
                        res.status(200).json({
                            success: true,
                            email: user.email,
                        });
                    }
                }
                else {
                    res.status(404).json({
                        success: false,
                        // status: '404', 
                        error: {
                            code: 'FORGOT_PASSWORD_003',
                            message: 'Email is not exists',
                        }
                    });
                }
            }
            catch (error) {
                next(error);
            }
        });
        this.createCodeExpire = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    email: req.body.email,
                };
                const code = (0, Helper_utils_1.generateSixDigitCode)();
                const response = yield UsersService.addCode(data, code);
                if (response) {
                    this.sendCodeToMail(data.email, code, Helper_utils_1.FORGOT_PASSWORD);
                    //Code auto delete after 60s
                    setTimeout(() => {
                        UsersService.deleteCode(data);
                    }, 60 * 1000);
                    res.status(200).json({
                        success: true,
                    });
                }
                //Write function to save code above in db by email
            }
            catch (error) {
                next(error);
            }
        });
        this.sendCodeToMail = (email, token, type) => __awaiter(this, void 0, void 0, function* () {
            const emailAgent = new Email();
            emailAgent.sendEmail(email, token, type);
        });
        this.checkForgotPasswordCode = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const data = {
                email: req.body.email,
                code: req.body.code,
            };
            const response = UsersService.checkCode(data);
            console.log(response);
            res.status(200);
            try {
                const response = UsersService.checkCode;
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        });
        this.setTokenCookie = (res, token) => {
            const cookieOptions = {
                maxAge: 5 * 60, // thời gian sống 5 phút
                // httpOnly: true, // chỉ có http mới đọc được token
                //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
            };
            res.cookie('access_token', token, cookieOptions);
        };
    }
}
exports.Auth = Auth;
