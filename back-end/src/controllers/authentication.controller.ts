/* eslint-disable */
import express, {Request, Response} from 'express';
import {
  FORGOT_PASSWORD,
  ACTIVATE_ACCOUNT, 
  generateSixDigitCode,
  sendCodeToMail,
  responseError
} from "../utils/Helper.utils";
import { HashClass } from '../utils/Hash.util';
import { UsersService } from '../services/users.service';
// const UsersService = require("../services/users.service");
const { Email } = require("../utils/Mail.utils");
import { User } from '../services/users.service';

export class Auth {
  public validateSignup = async (data: User) => {
    const checkUsername = await UsersService.find({ username: data.username });
    if (checkUsername) {
      return { success: false, error: 'Username already exist' };
    }

    const checkEmail = await UsersService.find({ email: data.email });
    if (checkEmail) {
      return { success: false, error: 'Email already exist' };
    }

    return { success: true };
  };

  public register = async (
    req: Request,
    res: Response,
    next: express.NextFunction
  ) => {
    const data = {
      username: req.body.username,
      email: req.body.email,
      full_name: req.body.fullName,
      password: req.body.password,
    };

    try {
      const validateResult = await this.validateSignup(data);
      if (!validateResult.success) {
        res.json(validateResult.error);
      } else {
        const user = await UsersService.create(data);
        const emailAgent = new Email();
        emailAgent.sendEmail(user.email, user.username, ACTIVATE_ACCOUNT);
        res.json('Create account success');
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public activateAccount = async (
    req: Request,
    res: Response
  ) => {
    try {
      const activateResult = await UsersService.activateAccount(
        req.params.name
      );
      res.json(activateResult);
    } catch (err) {
      console.log(err);
    }
  };

  public signIn = async (
    req: Request,
    res: Response,
    next: express.NextFunction
  ) => {
    try {
      const data = {
        username: req.body.username,
        password: req.body.password,
      };

      const response = await UsersService.authenticate(data);
      console.log(response);
      console.log(response.accessToken);
      // this.setTokenCookie(res, response.accessToken);
      res.cookie('access_token', response.accessToken, {
        maxAge: 5 * 60,
        httpOnly: true,
      });
      res.status(200).json(response);
    } catch (error) {
      if (error === 'Username or password is incorrect') {
        res.status(403).json({ status: '403', error: error });
      } else {
        res.status(404).json({ status: '404', error: 'Invalid request' });
      }
    }
  };

  public forgotPassword = async (
    req: Request,
    res: Response
  ) => {
    try {
      const userEmail = {
        email: req.body.email,
      };

      const user = await UsersService.find(userEmail);
      

      if(!user) {
        responseError(res,400,'FORGOT_PASSWORD_003','Your account is not exists');
      }else{
        if(!user.active) {
        responseError(res,400,"FORGOT_PASSWORD_004","Your account is not verified");
        }else if(user.code) {
        responseError(res,400,"FORGOT_PASSWORD_011","Your code has exists, please check your email");
        }
        
        res.status(200).json({
          success: true,
          email: HashClass.encode(user.email || ''),
        });
      }
      
    } catch (error : any) {
      responseError(res,500,'500','Internal server error');
    }
  };

  public createCodeExpire = async (
    req: Request,
    res: Response
  ) => {
    try {
      const userEmail = {
        email: HashClass.decode(req.body.email),
      };
      const code = generateSixDigitCode();
      await UsersService.addCode(userEmail, Number(code));

      sendCodeToMail(userEmail.email, code, FORGOT_PASSWORD);

      setTimeout(() => {
        UsersService.deleteCode(userEmail);
      }, 60 * 1000);

      res.status(200).json({
        success: true,
      });
    } catch (error : any) {
      res.status(500).json({
        error,
      });
    }
  };

  public checkForgotPasswordCode = async (
    req: Request,
    res: Response
  ) => {
    const codeOfUser = {
      email: HashClass.decode(req.body.email),
      code: req.body.code,
    };

    try {
      const response = await UsersService.checkCode(codeOfUser);
      res.status(200).json({
        success: true,
        email: HashClass.encode(response.email),
      });
    } catch (error : any) {
      responseError(res,400,error.code,error.message);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response
  ) => {
    const newPasswordOfUser = {
      email: HashClass.decode(req.body.email),
      password: req.body.password,
    };

    try {
      await UsersService.resetPassword(newPasswordOfUser);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_010',
          message: error,
        },
      });
    }
  };
}
