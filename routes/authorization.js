const express = require('express');
const authRouter = express.Router()
const passport = require('passport');

const authorizationController = require('../controllers/authorization')
const jwt = require("jsonwebtoken");

authRouter.post('/login', authorizationController.loginAuth)

authRouter.get('/google-login',
    passport.authenticate('google', {scope: ['profile', 'email']}));

authRouter.get('/callback',
    passport.authenticate('google', {session:false, failureRedirect: '/login'}),
    function (req, res, next) {
    const decoded = jwt.decode(req.user.token);
        req.user = {
            ...req.user,
            ...decoded
        }

        req.headers.authorization = 'Bearer ' + req.user.token;

        res.redirect(`${process.env.CLIENT_URL}/me?token=${req.user.token}`)
    });

module.exports = authRouter