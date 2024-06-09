const AuthorModel = require("../models/authors");
const bcrypt = require("bcrypt");

const getAllAuthors = async (req, res, next) => {
    const {page = 1, size = 25} = req.query

    try {
        const totAuthors = await AuthorModel.countDocuments()
        const totalPages = Math.ceil(totAuthors / size)
        const authors = await AuthorModel.find()
            .limit(size)
            .skip((page - 1) * size)
            .sort({createdAt: -1});

        res.status(200).json({page: +page, limit: +size, totalPages: totalPages, authors});
    } catch (error) {
        next(error)
    }
};

const getAuthorById = async (req, res) => {
    const id = req.params.id;
    try {
        const author = await AuthorModel.findById(id).select(["_id", "name", "lastname", "avatar", "email", "posts"]);

        res.status(200).json(author);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createAuthor = async (req, res, next) => {
    const {password, email} = req.body

    const userExist = await AuthorModel.findOne({email})

    if (userExist) {
        return res.status(400).json({message: 'User already exists'})
    }

    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) return res.status(500).json({message: err.message});

        const newAuthor = new AuthorModel({
            ...req.body,
            password: hash,
        });
        await newAuthor.save(newAuthor);
        next()
    });

};

const modAuthor = async (req, res) => {
    const id = req.params.id;
    const bodyRequest = req.body;

    try {
        const editAuthor = await AuthorModel.findByIdAndUpdate(
            id,
            bodyRequest,
            {new: true}
        );
        res.status(201).json(editAuthor);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const deleteAuthor = async (req, res) => {
    const id = req.params.id;

    try {
        await AuthorModel.findByIdAndDelete(id);

        res.status(200).json({message: "Author deleted"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getPostsByAuthorId = async (req, res) => {
    const id = req.params.id;

    try {
        const authorPosts = await AuthorModel.findById(id)
            .sort({createdAt: -1})
            .populate('posts');

        res.status(200).json(authorPosts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getCurrentUser = async (req, res) => {
    const id = req.user?.userId

    try {
        if (!id) return res.status(404).json({message: 'User not found'});

        const user = await AuthorModel.findById(id)

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    modAuthor,
    deleteAuthor,
    getPostsByAuthorId,
    getCurrentUser
};
