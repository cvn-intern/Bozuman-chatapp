/* eslint-disable */
import {Users} from '../models/users.model';
import * as jwt from 'jsonwebtoken'
import _CONF from '../configs/auth.config'
import {RefreshToken} from '../models/refreshToken.model'
import crypto from 'crypto' 

export interface User {
  username: string;
  password: string;
  full_name: string;
  email: string;
  _id: string
}

export class UsersService {
  static create = async (data: User) => {
    try {
      const user = {
        username: data.username,
        password: data.password,
        full_name: data.full_name,
        email: data.email,
      };
      const response = await new Users(user).save();
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  static find = async (data: any) => {
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
 
  static authenticate = async (data: User) => {
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
      success: true,
      accessToken,
      refreshToken: refreshToken.token,
    };
  };

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
    return crypto.randomBytes(40).toString('hex');
  };

};
