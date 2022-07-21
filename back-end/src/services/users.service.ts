/* eslint-disable */
const { Users } = require('../models/users.model');
const jwt = require('jsonwebtoken')
const _CONF = require('../configs/auth.config')
const RefreshToken = require('../models/refreshToken.model')
const crypto1 = require('crypto');

export interface User {
  username: string;
  password: string;
  full_name?: string;
  email?: string;
  active?: boolean;
  _id?: string,
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
    user.code = undefined;
    return user.save();
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
    
    user.password = password;
    return await user.save();
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
