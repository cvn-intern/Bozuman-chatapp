import express from 'express';
var validator = require('validator');

class Auth {

  public validate (fullName: string, email: string, userName: string, password: string) {
    // if (!validator.isEmail(email)) {
    //   return {success: false, error: 'Email must be in correct format'};
    // }
    // return {success: true};
    var obj = {success: true};
    return obj;
  }

  public async register (req: express.Request, res: express.Response) {
    var {fullName, email, userName, password} = req.body; 
    
    res.json({success: true});
    
  }

}
module.exports = {Auth};