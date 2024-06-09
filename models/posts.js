const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
    {
        category: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            required: false,
            default: 'https://picsum.photos/600/480'
        },
        readTime: {
            value: Number,
            unit: String,
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AuthorModel',
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    {timestamps: true, strict: true}
);

module.exports = mongoose.model("PostModel", PostSchema, "posts");
