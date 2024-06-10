require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const passport = require("passport");
const GoogleStrategy = require('./controllers/oAuthGoogle');

const authorsRoute = require("./routes/authors");
const postsRoute = require('./routes/posts')
const authRoute = require("./routes/authorization");

const errorHandler = require("./middlewares/errorHandler");

const server = express();
const port = process.env.PORT;
const dbName = "strive-blog";

server.use(cors());
server.use(express.json());

passport.use('google', GoogleStrategy)

server.use('/api/auth', authRoute)
server.use("/api/authors", authorsRoute);
server.use('/api/blogPosts', postsRoute)

server.use(errorHandler)

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI + dbName);
        server.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
