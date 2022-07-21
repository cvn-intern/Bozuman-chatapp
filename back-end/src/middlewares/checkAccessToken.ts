
import * as jwt from 'jsonwebtoken'
import _CONF from '../configs/auth.config'
import express from 'express';

export interface requestWithToken extends express.Request {
  decoded: {};
}

export const checkAccessToken = () => (
  req: requestWithToken,
  res: express.Response,
  next: express.NextFunction
) => {
  const token: string = req.headers['x-access-token'];
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
