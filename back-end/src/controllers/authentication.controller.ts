/* eslint-disable */
import express from 'express';
import {
  FORGOT_PASSWORD,
  generateSixDigitCode,
  sendCodeToMail,
} from '../utils/Helper.utils';
import { UsersService } from '../services/users.service';
import { Email } from '../utils/Mail.utils';
import { ACTIVATE_ACCOUNT } from '../utils/Helper.utils';
import { User } from '../services/users.service';

export class Auth {
  public validateSignup = async (data: User) => {
    const user = await UsersService.find(data);
    if (!user) {
      return { success: true };
    }
    if (user.username == data.username) {
      return {
        success: false,
        error: 'Username already exist',
        errorCode: 'SIGNUP009',
      };
    } else if (user.email == data.email) {
      return {
        success: false,
        error: 'Email already exist',
        errorCode: 'SIGNUP010',
      };
    }

    return { success: true };
  };

  public register = async (
    req: express.Request,
    res: express.Response,
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
        res.json({
          success: false,
          error: {
            code: validateResult.errorCode,
            message: validateResult.error,
          },
        });
      } else {
        const user = await UsersService.create(data);
        const emailAgent = new Email();
        emailAgent.sendEmail(user.email, user.username, ACTIVATE_ACCOUNT);
        res.json({ success: true });
      }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public activateAccount = async (
    req: express.Request,
    res: express.Response
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
    req: express.Request,
    res: express.Response,
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

  public getUserByEmail = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const userEmail = {
        email: req.body.email,
      };

      const user = await UsersService.find(userEmail);
      if (!user.active) {
        res.status(400).json({
          success: false,
          error: {
            code: 'FORGOT_PASSWORD_004',
            message: 'Your account is not verified',
          },
        });
      }
      res.status(200).json({
        success: true,
        email: user.email,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_003',
          message: error,
        },
      });
    }
  };

  public createCodeExpire = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      const data = {
        email: req.body.email,
      };
      const code = generateSixDigitCode();
      await UsersService.addCode(data, Number(code));

      sendCodeToMail(data.email, code, FORGOT_PASSWORD);

      setTimeout(() => {
        UsersService.deleteCode(data);
      }, 60 * 1000);

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  };

  public checkForgotPasswordCode = async (
    req: express.Request,
    res: express.Response
  ) => {
    const codeOfUser = {
      email: req.body.email,
      code: req.body.code,
    };

    try {
      const response = await UsersService.checkCode(codeOfUser);
      res.status(200).json({
        success: true,
        email: response.email,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'FORGOT_PASSWORD_005',
          message: error,
        },
      });
    }
  };

  public resetPassword = async (
    req: express.Request,
    res: express.Response
  ) => {
    const newPasswordOfUser = {
      email: req.body.email,
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
