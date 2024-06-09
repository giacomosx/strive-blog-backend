const PostModel = require("../models/posts");
const AuthorModel = require("../models/authors");

const getAllPosts = async (req, res, next) => {
    const {page = 1, size = 25} = req.query;
    const title = req.query.title;

    try {
        if (title) {
            const filterPostsByTitle = await PostModel.find({
                title: title
            });
            res.status(200).json(filterPostsByTitle);
        } else {
            const totPosts = await PostModel.countDocuments();
            const totalPages = Math.ceil(totPosts / size);
            const allPosts = await PostModel.find()
                .limit(size)
                .skip((page - 1) * size)
                .sort({ createdAt: -1 })
                .populate('authorId');
            res
                .status(200)
                .json({page: +page, limit: +size, totalPages: totalPages, posts: allPosts});
        }
    } catch (error) {
        next(error)
    }
};

const getPostById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id).populate('authorId');
        res.status(200).json(post);
    } catch (error) {
        next(error)
    }
};

const createPost = async (req, res, next) => {

    try {
        const post = new PostModel({
            ...req.body,
            authorId: req.user.userId
        });

        const relatedAuthor = await AuthorModel.findById(post.authorId)
        await post.save();
        relatedAuthor.posts.push(post._id)
        relatedAuthor.save()

        next()
    } catch (error) {
        next(error)
    }
};

const editPost = async (req, res, next) => {
    const id = req.params.id;
    const bodyRequest = req.body;
    const options = {new: true};

    try {
        const editedPost = await PostModel.findByIdAndUpdate(id, bodyRequest, options);
        res.status(201).json(editedPost);
    } catch (error) {
        next(error)
    }
};

const deletePost = async (req, res, next) => {
    const id = req.params.id;

    try {
        const post = await PostModel.findById(id)
        const relatedAuthor = await AuthorModel.findById(post.authorId)
        const deletedPost = await PostModel.findByIdAndDelete(id);

        relatedAuthor.posts.pull(post._id)
        relatedAuthor.save()

        res.status(200).json({message: "Post deleted", deletedPost});
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getAllPosts, getPostById, createPost, editPost, deletePost,
};
