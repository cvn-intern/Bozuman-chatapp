import express from 'express';
var validator = require('validator');
const { AuthModel } = require('../models/authentication.model');
const mongoose = require('mongoose');
class Auth {

  private model: any;

  constructor() {
    this.model = new AuthModel();
  }

  public validate  = () => {
    // if (!validator.isEmail(email)) {
    //   return {success: false, error: 'Email must be in correct format'};
    // }
    // return {success: true};
    return 'abc';
  }

  public register = async (req: express.Request, res: express.Response) => {
    var {fullName, email, userName, password} = req.body; 
    var result = this.model.register();
    res.json(result);
  }

  public getAll = (req: express.Request, res: express.Response) => {
    var result = mongoose.model.find()
    res.json(result);
  }
}
module.exports = {Auth};