const AuthorModel = require('../models/authors');

var GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const {loginAuth} = require("./authorization");

const googleStrategy = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    },  async(accessToken, refreshToken, profile, done) => {
    try {
        const {email} = profile._json
        const author = await AuthorModel.findOne({email})

        if (author) {
            const token = jwt.sign({userId: author._id, email},
                process.env.JWT_SECRET_KEY,
                {expiresIn: '5m'});

            done(null, {token});
        } else {
            try {
                const newAuthor = new AuthorModel({
                    name: profile._json.given_name,
                    lastname: profile._json.family_name,
                    birth_date: '----',
                    email: email,
                    avatar: profile._json.picture,
                    password: ' '
                })
                await newAuthor.save()

                const token = jwt.sign({userId: user._id, email},
                    process.env.JWT_SECRET_KEY,
                    {expiresIn: '5m'});

                done(null, {token, newAuthor});
            } catch (e) {
                console.log(e)
            }
        }

    } catch(err) {
        console.log(err);
    }
})


module.exports = googleStrategy;