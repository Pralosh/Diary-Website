const express = require('express');
const router = express.Router();

// ./auth.js exports.login = const login
const { login, register, update } = require('./auth.js');
const { checkAuth } = require('../middleware/auth');

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/update').put(checkAuth, update);

module.exports = router;