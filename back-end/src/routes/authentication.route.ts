const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authentication.controller');

router.get('/login', login);

module.exports = router;