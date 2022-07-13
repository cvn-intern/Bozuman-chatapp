const express = require('express');
const router = express.Router();
const { Auth } = require('../controllers/authentication.controller');


const authentication = new Auth();

router.post('/register', authentication.register);
router.get('/activate_account/:name', authentication.activateAccount)
module.exports = router;