import express from 'express';
const UsersService = require('../services/users.service');
const { Email } = require('../utils/Mail.utils');
var validator = require('validator');

class Auth {
  public validateSignup = async (data: any) => {
    if (!validator.isEmail(data.email)) {
      return {success: false, error: 'Email must be in correct format'};
    } else if (!validator.isLength(data.userName, {min: 8, max: 32})){
      return {success: false, error: 'Username must have 8-32 character'};
    } else if (!validator.isLength(data.fullName, {min: 8, max: 50})){
      return {success: false, error: 'Full name must have 8-50 character'};
    } else if (!validator.isLength(data.password, {min: 8, max: 16})){
      return {success: false, error: 'Password must have 8-16 character'};
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.userName)) {
      return {success: false, error: 'Username can not contain special character'};
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.fullName)) {
      return {success: false, error: 'Full name can not contain special character'};
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.password)) {
      return {success: false, error: 'Password can not contain special character'};
    }

    const checkUsername = await UsersService.find({userName: data.userName});
    if (checkUsername.length > 0) {
      return {success: false, error: 'Username already exist'};
    }

    const checkEmail = await UsersService.find({email: data.email});
    if (checkEmail.length > 0) {
      return {success: false, error: 'Email already exist'};
    }

    return {success: true};
  }

  public register = async (req: express.Request, res: express.Response) => {
    const data = {
      userName: req.body.userName,
      email: req.body.email,
      fullName: req.body.fullName,
      password: req.body.password
    };

    try {
      const validateResult = await this.validateSignup(data);
      if (!validateResult.success) {
        res.json(validateResult.error);
      } else {
        var user = await UsersService.create(data);
        const emailAgent = new Email();
        console.log(emailAgent);
        emailAgent.sendEmail(user.email, user.username);
        res.json("Create account success");
      }
    } catch (error) {
      res.status(500).json({error: error});
    }
  }

  public activateAccount = async (req: express.Request, res: express.Response) => {
    try {
      const activateResult = await UsersService.activateAccount(req.params.name);
      res.json(activateResult);
    } catch (err) {
      console.log(err);
    }
  }

  public signIn = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const data = {
        username: req.body.username,
        password: req.body.password,
        ipAddress: req.ip
      }
      // const { username, password } = req.body;
      // const ipAddress = req.ip;
      const response  = await UsersService.authenticate(data);
      res.json(response);

    }catch(error) {
      res.status(500).json({ error: "123" });
    }
  }


}
module.exports = { Auth };
