const express = require('express')
const posts = express.Router()
const controller = require('../controllers/posts')
const upload = require('../utils/fileUpload')
const sendEmail = require('../utils/sendEmail')
const auth = require('../middlewares/tokenController')

posts.route('/').get(controller.getAllPosts)
posts.route('/:id').get(controller.getPostById)
posts.route('/category/:category').get(controller.getPostByCategory)

posts.route('/create').post(auth.verifyToken,  controller.createPost, sendEmail.newPost )
posts.route('/upload').post( auth.verifyToken, upload.single('image'), async (req, res) => {
    try {
        res.status(200).json({ source: req.file.path })
    } catch (e) {
        res.status(500).send(e.message)
    }
} )

posts.route('/edit/:id').put(auth.verifyToken, controller.editPost)

posts.route('/delete/:id').delete(auth.verifyToken, controller.deletePost)

module.exports = posts