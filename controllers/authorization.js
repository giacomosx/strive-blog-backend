const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Author = require('../models/authors');


const loginAuth = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await Author.findOne({email})

        if (!user) return res.status(401).json({message: 'Invalid email or password'});

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) return res.status(401).json({message: 'Invalid email or password'});

        const token = jwt.sign({userId: user._id, email},
            process.env.JWT_SECRET_KEY,
            {expiresIn: '5m'});

        const userData = {
            userId: user._id,
            name: user.name,
            avatar: user.avatar
        }

        res.status(200).json({token, userData});


    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = {
    loginAuth,
}