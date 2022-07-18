/* eslint-disable */
import { isSet } from 'util/types';

const { Users } = require('../models/users.model');
const jwt = require('jsonwebtoken')
const _CONF = require('../configs/auth.config')
const RefreshToken = require('../models/refreshToken.model')
const crypto1 = require('crypto');

interface User {
  username: string;
  password: string;
  full_name: string;
  email: string;
}

module.exports = class UsersService {
  static create = async (data: any) => {
    try {
      const user = {
        username: data.username,
        password: data.password,
        full_name: data.fullName,
        email: data.email,
      };
      const response = await new Users(user).save();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  static find = async (data: any) => {
    //TODO: It will return one element so we should return an object instead of array,
    if (data.username) {
      const userList = await Users.find({ username: data.username }).exec();
      return userList;
    } else if (data.email) {
      const userList = await Users.find({ email: data.email }).exec();
      return userList;
    }
  };

  static activateAccount = async (userName: string) => {
    try {
      await Users.findOneAndUpdate(
        { username: userName },
        { active: true }
      ).exec();
      return 'Activate account success';
    } catch (err) {
      console.log(err);
    }
  };
  // authenticating to user when sigin in
  static authenticate = async (data: any) => {
    const { username, password } = data;
    const user = await Users.findOne({ username: username }).exec();
    if (!user || password != user.password) {
      throw 'Username or password is incorrect';
    }
    if (!user.active) {
      throw 'Your account is inactive';
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await refreshToken.save();
    return {
      // ...this.basicDetails(user),
      success: true,
      accessToken,
      refreshToken: refreshToken.token,
    };
  }
  //All function 
  //add forgot-password code to database
  static addCode = async (data: any, code: number) => {
    const userEmail = data.email;
    const doc = await Users.findOneAndUpdate(
      { email: userEmail },
      { code: code },
      { new: true}
    );
    return doc;
  }

  static deleteCode = async (data: any) => {
    const userEmail = data.email;
    const user = await Users.findOne({email: userEmail});
    user.code = undefined;
    return user.save();
  }

  static checkCode = async (data: any) => {
    const email = data.email;
    const code = data.code;
    const user = await Users.findOne({
      email: email,
      code: code,
    });
    return user;
  }

  static checkSameOldPassword = async (data: any) => {
    const email = data.email;
    const password = data.password;
    const user = await Users.findOne({
      email,
      password
    })
    return user;
  }

  static resetPassword = async (data: any) => {
    const email = data.email;
    const password = data.password;
    const user = await Users.findOneAndUpdate(
      {email: email},
      {password: password},
      {new: true}
    );
    return user;
  }

  static generateAccessToken = (user: any) => {
    return jwt.sign({ id: user._id }, _CONF.SECRET, {
      expiresIn: _CONF.tokenLife,
    });
  };

  static generateRefreshToken = (user: any) => {
    return new RefreshToken({
      user: user._id,
      token: jwt.sign(
        { randomString: this.randomTokenString() },
        _CONF.SECRET_REFRESH,
        {
          expiresIn: _CONF.refreshTokenLife,
        }
      ),
    });
  };

  static randomTokenString = () => {
    return crypto1.randomBytes(40).toString('hex');
  };

  static basicDetails = (user: any) => {
    const { _id } = user;
    return { _id };
  };
};
