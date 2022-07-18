/* eslint-disable */
const jwt = require('jsonwebtoken');
const _CONF = require('../configs/auth.config');
// import jwt from "jsonwebtoken"
import express from 'express';

export interface requestWithToken extends express.Request {
  decoded: any;
}

module.exports = (
  req: requestWithToken,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers['x-access-token'];
  // decode token
  if (token) {
    jwt.verify(token, _CONF.SECRET, function (err: any, decoded: any) {
      if (err) {
        return res
          .status(401)
          .json({ error: true, message: 'Unauthorized access.', err });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(403).send({
      error: true,
      message: 'No token provided.',
    });
  }
};
