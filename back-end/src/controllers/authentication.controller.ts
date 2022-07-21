/* eslint-disable */
import { Request, Response } from 'express';
import {
  FORGOT_PASSWORD,
  generateSixDigitCode,
  sendCodeToMail,
  ACTIVATE_ACCOUNT,
} from '../utils/Helper.utils';
import { UsersService, User } from '../services/users.service';
import { Email } from '../utils/Mail.utils';
<<<<<<< HEAD

export interface TypedRequestBody<T> extends Request {
  body: T
}

export class Auth {
  public validateSignup = async (data: User) => {
    const checkUsername: User = await UsersService.find({
      username: data.username,
    });
    if (checkUsername) {
      return { success: false, error: 'Username already exist' };
    }

    const checkEmail: User = await UsersService.find({ email: data.email });
    if (checkEmail) {
      return { success: false, error: 'Email already exist' };
=======
import { ACTIVATE_ACCOUNT } from '../utils/Helper.utils';
import { User } from '../services/users.service';
import md5 from 'md5';


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
        errorCode: 'SIGNUP_009',
      };
    } else if (user.email === data.email) {
      return {
        success: false,
        error: 'Email already exist',
        errorCode: 'SIGNUP_010',
      };
>>>>>>> caf81df4df529e9f75eaa4aa860a48c66ff99077
    }

    return { success: true };
  };

<<<<<<< HEAD
  public register = async (req: Request, res: Response) => {
    const inputData = req.body as User
=======
  public register = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = {
      username: req.body.username,
      email: req.body.email,
      full_name: req.body.fullName,
      password: md5(req.body.password)
    };
>>>>>>> caf81df4df529e9f75eaa4aa860a48c66ff99077
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
<<<<<<< HEAD
        const user = await UsersService.create(inputData);
        if (user) {
          const emailAgent = new Email();
          emailAgent.sendEmail(user.email, user.username, ACTIVATE_ACCOUNT);
          res.json('Create account success');
        }
=======
        const user = await UsersService.create(data);
        const emailAgent = new Email();
        emailAgent.sendEmail(user.email, user.username, ACTIVATE_ACCOUNT);
        res.json({ success: true });
>>>>>>> caf81df4df529e9f75eaa4aa860a48c66ff99077
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
<<<<<<< HEAD
      const inputData = req.body as User
      const response = await UsersService.authenticate(inputData);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: { code: error.code, message: error.message },
      });
=======
      const input = {
        username: req.body.username,
        password: req.body.password,
      };
      const response = await UsersService.authenticate(input);
      res.status(200).json(response);
    } catch (error:any) {
        res.status(400).json({ success: false, error: {code: error.code, message: error.message} });
>>>>>>> 1b453de1e6e1481f9e8ededd97afa6b4a2f2ca86
    }
  };

  public getUserByEmail = async (req: TypedRequestBody<{email: string}>, res: Response) => {
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

  public createCodeExpire = async (req: TypedRequestBody<{email: string}>, res: Response) => {
    try {
      const data = {
        email: req.body.email,
      };
      const code = generateSixDigitCode();
      await UsersService.addCode(data, Number(code));

      await sendCodeToMail(data.email, code, FORGOT_PASSWORD);

      setTimeout(() => {
        (async () => {
          await UsersService.deleteCode(data);
        })
        
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

  public checkForgotPasswordCode = async (req: TypedRequestBody<{email: string, code: string}>, res: Response) => {
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

  public resetPassword = async (req: TypedRequestBody<{email: string, password: string}>, res: Response) => {
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
