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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const { Users } = require('../models/users.model');
const jwt = require('jsonwebtoken');
const _CONF = require('../configs/auth.config');
const RefreshToken = require('../models/refreshToken.model');
const crypto1 = require('crypto');
module.exports = (_a = class UsersService {
    },
    _a.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = {
                username: data.username,
                password: data.password,
                full_name: data.fullName,
                email: data.email
            };
            const response = yield new Users(user).save();
            return response;
        }
        catch (error) {
            console.log(error);
        }
    }),
    _a.find = (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.username) {
            const userList = yield Users.find({ username: data.username }).exec();
            return userList;
        }
        else if (data.email) {
            const userList = yield Users.find({ email: data.email }).exec();
            return userList;
        }
    }),
    _a.activateAccount = (userName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Users.findOneAndUpdate({ username: userName }, { active: true }).exec();
            return 'Activate account success';
        }
        catch (err) {
            console.log(err);
        }
    }),
    // authenticating to user when sigin in
    _a.authenticate = (data) => __awaiter(void 0, void 0, void 0, function* () {
        const { username, password, ipAddress } = data;
        const user = yield Users.findOne({ username: username }).exec();
        if (!user || password != user.password) {
            throw 'Username or password is incorrect';
        }
        const accessToken = _a.generateAccessToken(user);
        const refreshToken = _a.generateRefreshToken(user, ipAddress);
        yield refreshToken.save();
        return Object.assign(Object.assign({}, _a.basicDetails(user)), { accessToken, refreshToken: refreshToken.token });
    }),
    _a.generateAccessToken = (user) => {
        return jwt.sign({ username: user.username, id: user._id }, _CONF.SECRET, {
            expiresIn: _CONF.tokenLife,
        });
    },
    _a.generateRefreshToken = (user, ipAddress) => {
        return new RefreshToken({
            user: user._id,
            token: jwt.sign({ randomString: _a.randomTokenString() }, _CONF.SECRET_REFRESH, {
                expiresIn: _CONF.refreshTokenLife,
            }),
            createdByIp: ipAddress,
        });
    },
    _a.randomTokenString = () => {
        return crypto1.randomBytes(40).toString('hex');
    },
    _a.basicDetails = (user) => {
        const { _id } = user;
        return { _id };
    },
    _a);
