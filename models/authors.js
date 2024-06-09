const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        birth_date: {
            type: String,
        },
        avatar: {
            type: String,
            required: true,
        },
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "PostModel",
        }]
    },

    {timestamps: true, strict: true}
);

module.exports = mongoose.model("AuthorModel", AuthorSchema, "authors");
