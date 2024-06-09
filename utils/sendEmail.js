const Author = require('../models/authors');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const newAuthor = (req, res, next) => {

    const msg = {
        to: req.body.email,
        from: "giacomo.bartoli@me.com", 
        subject: "Welcome aboard " + req.body.name,
        text: "Now you’re part of the Strive Blog family! ",
        html: "<strong>Now you’re part of the Strive Blog family!</strong>",
    };
    sgMail
    .send(msg)
    .then(() => {
        res.status(200).json({message: 'Email sent'})
    })
    .catch((error) => {
        res.status(500).json(error.message);
    });
};

const newPost = async (req, res, next) => {
    const author = await Author.findById(req.user.userId);

    const msg = {
        to: author.email,
        from: "giacomo.bartoli@me.com",
        subject: "Post published",
        text: `Good news ${author.name}, you're post has been published! `,
        html: `<strong>Good news ${author.name}, you're post has been published!</strong>`,
    };
    sgMail
    .send(msg)
    .then(() => {
        res.status(201).json({message: 'Email sent'})
    })
    .catch((error) => {
        res.status(500).json(error.message);
    });
};


module.exports = {
    newAuthor,
    newPost
}


// https://github.com/sendgrid/sendgrid-nodejs