/* eslint-disable */

import * as jwt from 'jsonwebtoken'
import _CONF from '../configs/auth.config'
import {UsersService} from '../services/users.service'
import express from 'express';

export interface requestWithToken extends express.Request {
  decoded: any;
}

export const expiredAccessTokenHandler = () => (
  req: requestWithToken,
  res: express.Response,
  next: express.NextFunction
) => {
  const refreshToken = req.headers['x-refresh-token'];
  // decode token
  if (refreshToken) {
    jwt.verify(
      refreshToken,
      _CONF.SECRET_REFRESH,
      function (err: any, decoded: any) {
        if (err) {
          console.error(err.toString());
          return res 
            .status(401)
            .json({ error: true, message: 'Unauthorized access.', err });
        }
        const {id} = decoded;
        const user = {
          _id: id
        };
        const accessToken = UsersService.generateAccessToken(user);
        res.status(200).json({
          success: true,
          accessToken,
          refreshToken: refreshToken,
        });
      }
    );
  } else {
    return res.status(403).send({
      error: true,
      message: 'No token provided.',
    });
  }
};
