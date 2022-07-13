const express = require('express');
const router = express.Router();
const { Auth } = require('../controllers/authentication.controller');


const authentication = new Auth();

router.post('/register', authentication.register);
router.get('/find', authentication.find);
module.exports = router;