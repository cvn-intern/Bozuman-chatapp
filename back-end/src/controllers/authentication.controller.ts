import express from "express";
const UsersService = require("../services/users.service");
var validator = require("validator");

class Auth {
  public validate = () => {
    // if (!validator.isEmail(email)) {
    //   return {success: false, error: 'Email must be in correct format'};
    // }
    // return {success: true};
    return "abc";
  };

  public register = async (req: express.Request, res: express.Response) => {
    try {
      const data = {
        userName: req.body.userName,
        email: req.body.email,
        fullName: req.body.fullName,
        password: req.body.password,
      };

      await UsersService.create(data);

      res.json("success");
    } catch (error) {
      res.status(500).json({ error: error });
    }
  };

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
