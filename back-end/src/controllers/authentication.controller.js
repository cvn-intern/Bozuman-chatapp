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
const UsersService = require("../services/users.service");
const { Email } = require("../utils/Mail.utils");
var validator = require("validator");
class Auth {
    constructor() {
        this.validateSignup = (data) => __awaiter(this, void 0, void 0, function* () {
            const checkUsername = yield UsersService.find({ username: data.username });
            if (checkUsername.length > 0) {
                return { success: false, error: "Username already exist" };
            }
            const checkEmail = yield UsersService.find({ email: data.email });
            if (checkEmail.length > 0) {
                return { success: false, error: "Email already exist" };
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
                    var user = yield UsersService.create(data);
                    const emailAgent = new Email();
                    emailAgent.sendEmail(user.email, user.username);
                    res.json("Create account success");
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
                const response = yield UsersService.authenticate(data);
                this.setTokenCookie(res, response.accessToken);
                res.json(response);
            }
            catch (error) {
                if (error === "Username or password is incorrect") {
                    res.status(403).json({ status: "403", error: error });
                }
                else {
                    res.status(404).json({ status: "404", error: "Invalid request" });
                }
            }
        });
        this.setTokenCookie = (res, token) => {
            const cookieOptions = {
                maxAge: 5 * 60,
                httpOnly: true, // chỉ có http mới đọc được token
                //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
            };
            res.cookie("access_token", token, cookieOptions);
        };
    }
}
module.exports = { Auth };
