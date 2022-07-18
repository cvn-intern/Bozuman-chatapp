"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const jwt = require('jsonwebtoken');
const _CONF = require('../config/');
module.exports = (req, res, next) => {
    // const token =
    //   req.body.token || req.query.token || req.headers["x-access-token"];
    const token = req.cookies.access_token;
    // decode token
    if (token) {
        jwt.verify(token, _CONF.SECRET, function (err, decoded) {
            if (err) {
                console.error(err.toString());
                return res
                    .status(401)
                    .json({ error: true, message: 'Unauthorized access.', err });
            }
            console.log(`decoded>>${decoded}`);
            req.decoded = decoded;
            next();
        });
    }
    else {
        return res.status(403).send({
            error: true,
            message: 'No token provided.',
        });
    }
};
