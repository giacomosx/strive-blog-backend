const express = require('express');
const authRouter = express.Router()
const authorizationController = require('../controllers/authorization')

authRouter.post('/login', authorizationController.loginAuth)

module.exports = authRouter