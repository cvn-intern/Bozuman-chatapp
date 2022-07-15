import express from "express";
const UsersService = require("../services/users.service");
const { Email } = require("../utils/Mail.utils");
var validator = require("validator");

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
      res.status(200).json(response);
    } catch (error) {
      if (error === "Username or password is incorrect") {
        res.status(403).json({ status: "403", error: error });
      } else {
        res.status(404).json({ status: "404", error: "Invalid request" });
      }
    }
  };

}
module.exports = { Auth };
