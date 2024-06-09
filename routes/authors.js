const express = require('express')
const authors = express.Router()
const controller = require('../controllers/authors')
const auth = require('../middlewares/tokenController')
const upload = require('../utils/fileUpload')
const sendEmail = require('../utils/sendEmail')

authors.route('/').get(controller.getAllAuthors)
authors.route('/me').get(auth.verifyToken, controller.getCurrentUser)
authors.route('/:id').get(controller.getAuthorById)
authors.route('/:id/blogPosts').get(controller.getPostsByAuthorId)

authors.route('/avatar').post(upload.single('image'), async (req, res) => {
    try {
        res.status(200).json({ source: req.file.path })
    } catch (e) {
        res.status(500).send(e.message)
    }
})
authors.route('/create').post(controller.createAuthor, sendEmail.newAuthor )

authors.route('/edit/:id').put(auth.verifyToken ,controller.modAuthor)

authors.route('/delete/:id').delete(auth.verifyToken ,controller.deleteAuthor)


module.exports = authors