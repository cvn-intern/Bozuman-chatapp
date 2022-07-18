/* eslint-disable */
const Joi = require('joi');
import express from 'express';
const router = express.Router();
const validator = require('express-joi-validation').createValidator({
  passError: true,
});

const { Auth } = require("../controllers/authentication.controller");
const { registerSchema, signInSchema } = require("../models/users.model");
const authentication = new Auth();

router.post(
  '/register',
  validator.body(registerSchema),
  authentication.register
);
router.get("/activate_account/:name", authentication.activateAccount);
router.post("/sign-in", authentication.signIn);

router.post('/forgot-password', authentication.getUserByEmail);
router.post('/create-code', authentication.createCodeExpire);
router.post('/check-code', authentication.checkForgotPasswordCode);
router.post('/reset-password', authentication.resetPassword);

router.use((err: any, req: any, res: any, next: any) => {
  if (err && err.error && err.error.isJoi) {
    // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be "query" here, but could be "headers", "body", or "params"
      message: err.error.toString(),
    });
  } else {
    // pass on to another error handler
    next(err);
  }
});
// used to test cookie
router.get("/get", (req: express.Request, res: express.Response) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.access_token;

  res.json({ token: token });
});

export default router;
