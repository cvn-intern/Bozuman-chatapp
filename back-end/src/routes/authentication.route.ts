const express = require('express');
const router = express.Router();
const { Auth } = require('../controllers/authentication.controller');

const authentication = new Auth();

router.post('/register', authentication.register);
router.post('/sign-in', authentication.signIn);

module.exports = router;