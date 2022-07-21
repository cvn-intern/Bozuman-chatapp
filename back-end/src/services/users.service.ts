/* eslint-disable */
import {Users} from '../models/users.model';
import * as jwt from 'jsonwebtoken'
import _CONF from '../configs/auth.config'
import {RefreshToken} from '../models/refreshToken.model'
import crypto from 'crypto' 

export interface User {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  active?: boolean;
  _id?: any;
  birth_day?: Date;
  gender?: boolean;
  phone?: string;
  avatar?: string;
  description?: string;
  code?: string;
  // TODO: Change room_list types
  room_list?: Array<string>;
}

export class UsersService {
  static create = async (data: any) => {
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

  static find = async (data: {username?: string, email?: string}) => {
    let user = await Users.findOne({$or:[{ username: data.username },{ email: data.email }]}).exec();
    return user;
  };

  static activateAccount = async (userName: string) => {
    try {
      const user = await Users.findOneAndUpdate(
        {username: userName} ,
        { active: true }
      ).exec();
      if (user) {
        return {sucess: true};
      }
      return {success: false};
    } catch (err) {
      console.log(err);
    }
  };
 
  static authenticate = async (data: User) => {
    const { username, password } = data;
    const user = await Users.findOne({ username: username }).exec();
    if (!user || password != user.password) {
      throw {
        code: 'SIGN_IN_007',
        message: 'Username or password is incorrect'
      }
      
    }
    if (!user.active) {
      throw {
        code: 'SIGN_IN_008',
        message: 'Your account is inactive'
      }
    }
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    await refreshToken.save();
    return {
      success: true,
      accessToken,
      refreshToken: refreshToken.token,
    };
  }

  static addCode = async (data: {email: string}, code: number) => {
    const userEmail = data.email;
    const doc = await Users.findOneAndUpdate(
      { email: userEmail },
      { code: code },
      { new: true}
    );
    if(!doc) {
      throw 'Internal server error';
    }
    return doc;
  }

  static deleteCode = async (data: {email: string}) => {
    const userEmail = data.email;
    const user = await Users.findOne({email: userEmail});
    if (user) {
      user.code = undefined;
      return user.save();
    }
    throw 'Server error';
  }

  static checkCode = async (data: {email: string, code: string}) => {
    const email = data.email;
    const code = data.code;
    const user = await Users.findOne({
      email: email,
      code: code,
    });
    if(!user) {
      throw 'Your code is incorrect';
    }
    return user;
  }

  static resetPassword = async (data: any) => {
    const email = data.email;
    const password = data.password;
    let user = await Users.findOne({
      email,
      password,
    });
    if(user) {
      throw 'New password must not be the same as the old password';
    }
    
    user = await Users.findOne({
      email
    });
    if (user) {
      user.password = password;
      return await user.save();
    }
    throw 'Server error';
  }

  static generateAccessToken = (user: any) => {
    return jwt.sign({ username: user.username }, _CONF.SECRET, {
      expiresIn: _CONF.tokenLife,
    });
  };

  static generateRefreshToken = (user: any) => {
    return new RefreshToken({
      username: user.username,
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
