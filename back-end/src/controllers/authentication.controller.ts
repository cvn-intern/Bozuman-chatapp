import express from 'express';
const UsersService = require('../services/users.service');
var validator = require('validator');

class Auth {

  public validate  = () => {
    // if (!validator.isEmail(email)) {
    //   return {success: false, error: 'Email must be in correct format'};
    // }
    // return {success: true};
    return 'abc';
  }

  public register = async (req: express.Request, res: express.Response) => {
    try {
      const data = {
        userName: req.body.userName,
        email: req.body.email,
        fullName: req.body.fullName,
        password: req.body.password
      };
      

      await UsersService.create(data);

      res.json("success");

   } catch (error) {
      res.status(500).json({error: error});
   }
  }

}
module.exports = {Auth};