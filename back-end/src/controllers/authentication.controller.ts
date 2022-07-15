import express from "express";
import { generateSixDigitCode } from '../utils/Helper.utils';
const UsersService = require("../services/users.service");
const { Email } = require("../utils/Mail.utils");
require('dotenv').config();

class Auth {
  public validateSignup = async (data: any) => {
    const checkUsername = await UsersService.find({ username: data.username });
    if (checkUsername.length > 0) {
      return { success: false, error: "Username already exist" };
    }

    const checkEmail = await UsersService.find({ email: data.email });
    if (checkEmail.length > 0) {
      return { success: false, error: "Email already exist" };
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
      fullName: req.body.fullName,
      password: req.body.password,
    };

    try {
      const validateResult = await this.validateSignup(data);
      if (!validateResult.success) {
        res.json(validateResult.error);
      } else {
        var user = await UsersService.create(data);
        //Sil wrote a function sendCodeToMail for send email, we can change this
        const emailAgent = new Email();
        emailAgent.sendEmail(user.email, user.username);
        res.json("Create account success");
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
        ipAddress: req.ip,
      };
      const response = await UsersService.authenticate(data);
      this.setTokenCookie(res, response.accessToken);
      res.json(response);
    } catch (error) {
      if (error === "Username or password is incorrect") {
        res.status(403).json({ status: "403", error: error });
      } else {
        res.status(404).json({ status: "404", error: "Invalid request" });
      }
    }
  };

  public getUserByEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = {
        email: req.body.email,
      }

      const response = await UsersService.find(data);
      //It returns an array, if response find success, user
      //is the first elements in array
      const user = response[0];
      if(user) {
        if(!user.active) {
          res.status(404).json({
            success: false,
            // status: '404', 
            error: {
              code: 'FORGOT_PASSWORD_004',
              message: 'Your account is not verified',
            }
          })
        } else {
          res.status(200).json({
            success: true,
            email: user.email,
          })
        }
      }else{
        res.status(404).json({
            success: false,
            // status: '404', 
            error: {
              code: 'FORGOT_PASSWORD_003',
              message: 'Email is not exists',
            }
          })
      }
    } catch (error) {
      next(error);
    }
  };

  public createCodeExpire = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const data = {
        email: req.body.email,
      }
      const code = generateSixDigitCode();
      const response = await UsersService.addCode(data, code);
      if(response){
        this.sendCodeToMail(data.email, code, process.env.FORGOT_PASSWORD);
        //Code auto delete after 60s
        setTimeout(() => {
          UsersService.deleteCode(data);
        }, 60 * 1000)
        res.status(200).json({
          success: true,
        })
      }
      //Write function to save code above in db by email
    } catch (error) {
      next(error);
    }
  }

  public sendCodeToMail = async (email: any, token: any, type: any) => {
    const emailAgent = new Email();
    emailAgent.sendEmail(email, token, type);
  }

  public checkForgotPasswordCode = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = {
      email: req.body.email,
      code: req.body.code,
    };

    try {
      const response = UsersService.checkCode
    } catch(error) {
      next(error);
    }
  }

  public resetPassword = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {

  }

  public setTokenCookie = (res: express.Response, token: string) => {
    const cookieOptions = {
      maxAge: 5 * 60, // thời gian sống 5 phút
      httpOnly: true, // chỉ có http mới đọc được token
      //secure: true; //ssl nếu có, nếu chạy localhost thì comment nó lại
    };
    res.cookie("access_token", token, cookieOptions);
  };
}
module.exports = { Auth };
