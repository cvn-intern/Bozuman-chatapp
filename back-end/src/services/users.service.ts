import { isSet } from "util/types";

const { Users } = require('../models/users.model');
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
        username: data.username,
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
    
    if (data.username) {
      const userList = await Users.find({ username: data.username }).exec();
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
  // authenticating to user when sigin in
  static authenticate = async (data: any) => {
    const {username, password, ipAddress} = data;
    const user = await Users.findOne({username: username}).exec();
    console.log(user)
    if (!user || password != user.password) {
      throw "Username or password is incorrect";
    }
    console.log(user)
    if (!user.active) {
      throw "Your account is inactive";
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user, ipAddress);
    await refreshToken.save();
    return {
      ...this.basicDetails(user),
      success: 'true',
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  static generateAccessToken = (user : any) => {
    return jwt.sign({ username: user.username, id: user._id }, _CONF.SECRET, {
      expiresIn: _CONF.tokenLife,
    });
  }
  
  static generateRefreshToken = (user: any, ipAddress: string) => {
    return new RefreshToken({
      user: user._id,
      token: jwt.sign({randomString: this.randomTokenString()}, _CONF.SECRET_REFRESH, {
        expiresIn: _CONF.refreshTokenLife,
      }),
      createdByIp: ipAddress,
    });
  }
  
  static randomTokenString = () => {
    return crypto1.randomBytes(40).toString("hex");
  }
  
  static basicDetails = (user:any) => {
    const { _id} = user;
    return { _id };
  }


}

