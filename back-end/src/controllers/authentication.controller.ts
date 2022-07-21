/* eslint-disable */
import { Request, Response } from 'express';
import {
  FORGOT_PASSWORD,
  ACTIVATE_ACCOUNT, 
  generateSixDigitCode,
  sendCodeToMail,
  responseError
} from "../utils/Helper.utils";
import { HashClass } from '../utils/Hash.util';
import { UsersService, User } from '../services/users.service';
import { Email } from '../utils/Mail.utils';
import md5 from 'md5';

export interface TypedRequestBody<T> extends Request {
  body: T
}

export class Auth {
  public validateSignup = async (data: User) => {
    const user = await UsersService.find(data);
    if (!user) {
      return { success: true };
    }
    if (user.username === data.username) {
      return {
        success: false,
        error: 'Username already exist',
        errorCode: 'SIGN_UP_009',
      };
    } else if (user.email === data.email) {
      return {
        success: false,
        error: 'Email already exist',
        errorCode: 'SIGN_UP_010',
      };
    }

    return { success: true };
  };

  public register = async (
    req: Request,
    res: Response
  ) => {
    const inputData = {
      username: req.body.username,
      email: req.body.email,
      full_name: req.body.fullName,
      password: md5(req.body.password)
    };
    try {
      const validateResult = await this.validateSignup(inputData);
      if (!validateResult.success) {
        res.json({
          success: false,
          error: {
            code: validateResult.errorCode,
            message: validateResult.error,
          },
        });
      } else {
        const user = await UsersService.create(inputData);
        if (user) {
          const emailAgent = new Email();
          emailAgent.sendEmail(user.email, user.username, ACTIVATE_ACCOUNT);
          res.json({ success: true });
        }
        }
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

  public activateAccount = async (req: Request, res: Response) => {
    try {
      const activateResult = await UsersService.activateAccount(
        req.params.name
      );
      res.json(activateResult);
    } catch (err) {
    }
  };

  public signIn = async (req: Request, res: Response) => {
    try {
      const inputData = req.body as User
      const response = await UsersService.authenticate(inputData);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { code: error.code, message: error.message },
      });
    }
  };

  public forgotPassword = async (req: TypedRequestBody<{email: string}>, res: Response) => {
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

  public createCodeExpire = async (req: TypedRequestBody<{email: string}>, res: Response) => {
    try {
      const userEmail = {
        email: HashClass.decode(req.body.email),
      };
      const code = generateSixDigitCode();
      await UsersService.addCode(userEmail, Number(code));

      await sendCodeToMail(userEmail.email, code, FORGOT_PASSWORD);

      setTimeout(() => {
        (async () => {
          await UsersService.deleteCode(userEmail);
        })();
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

  public checkForgotPasswordCode = async (req: TypedRequestBody<{email: string, code: string}>, res: Response) => {
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

  public resetPassword = async (req: TypedRequestBody<{email: string, password: string}>, res: Response) => {
    const newPasswordOfUser: User = {
      username: '',
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
