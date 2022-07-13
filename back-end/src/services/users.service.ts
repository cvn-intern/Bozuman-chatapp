import { isSet } from "util/types";

const Users = require('../models/users.model');
var jwt = require('jsonwebtoken')
const _CONF = require('../configs/auth.config')
const RefreshToken = require("../models/refreshToken.model.js")
const crypto1 = require("crypto");

interface User {
  username: string,
  password: string,
  full_name: string,
  email: string
}

module.exports = class UsersService{
  
  static create = async (data: any) => {
    try {
      const user = {
        username: data.userName,
        password: data.password,
        full_name: data.fullName,
        email: data.email
      }
      const response = await new Users(user).save();
      return response;
    }
    catch (error) {
      console.log(error);
    }  
  }

  static find = async (data: any) => {
    if (data.userName) {
      const userList = await Users.find({ username: data.userName }).exec();
      return userList;
    } else if (data.email) {
      const userList = await Users.find({ email: data.email }).exec();
      return userList;
    } 
  }

  static activateAccount = async (userName: string) => {
    try {
      await Users.findOneAndUpdate({username: userName}, {active: true}).exec();
      return 'Activate account success';
    } catch (err) {
      console.log(err);
    }
  }
  // sign in
  static authenticate = async (data: any) => {
    const {username, password, ipAddress} = data;
    const user = await Users.findOne({username: username}).exec();
    console.log(user)
    if (!user || password != user.password) {
      throw "Username or password is incorrect";
    }
  
    // authentication successful so generate jwt and refresh tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, ipAddress);
  
    // save refresh token
    await refreshToken.save();
  
    // return basic details and tokens
    return {
      ...this.basicDetails(user),
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  static generateAccessToken = (user : any) => {
    return jwt.sign({ username: user.username, id: user._id }, _CONF.SECRET, {
      expiresIn: _CONF.tokenLife,
    });
  }
  
  static generateRefreshToken = (user: any, ipAddress: any) => {
    return new RefreshToken({
      user: user._id,
      token: this.randomTokenString(),
      expires: _CONF.refreshTokenLife,
      createdByIp: ipAddress,
    });
  }
  
  static randomTokenString = () => {
    return crypto1.randomBytes(40).toString("hex");
  }
  
  static basicDetails = (user:any) => {
    const { username, full_name, email} = user;
    return { username, full_name, email };
  }

  // static refreshToken = async ({ token, ipAddress }) => {
  //   const refreshToken = await this.getRefreshToken(token);
  //   const { user } = refreshToken;
  
  //   // replace old refresh token with a new one and save
  //   const newRefreshToken = this.generateRefreshToken(user, ipAddress);
  //   refreshToken.revoked = Date.now();
  //   refreshToken.revokedByIp = ipAddress;
  //   refreshToken.replacedByToken = newRefreshToken.token;
  //   await refreshToken.save();
  //   await newRefreshToken.save();
  
  //   // generate new jwt
  //   const jwtToken = this.generateJwtToken(user);
  
  //   // return basic details and tokens
  //   return {
  //     ...this.basicDetails(user),
  //     jwtToken,
  //     refreshToken: newRefreshToken.token,
  //   };
  // }
  
  // static revokeToken = async ({ token, ipAddress }) => {
  //   const refreshToken = await this.getRefreshToken(token);
  
  //   // revoke token and save
  //   refreshToken.revoked = Date.now();
  //   refreshToken.revokedByIp = ipAddress;
  //   await refreshToken.save();
  // }

  // static getRefreshTokens = async (userId) => {
  //   // check that user exists
  //   await this.getUser(userId);
  
  //   // return refresh tokens for user
  //   const refreshTokens = await RefreshToken.find({ user: userId });
  //   return refreshTokens;
  // }

  // static getUser = async (id:any) => {
  //   // if (!db.isValidId(id)) throw "User not found";
  //   const user = await Users.findById(id);
  //   if (!user) throw "User not found";
  //   return user;
  // }
  
  // static getRefreshToken = async (token) => {
  //   const refreshToken = await RefreshToken.findOne({ token }).populate(
  //     "user"
  //   );
  //   if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  //   return refreshToken;
  // }


}