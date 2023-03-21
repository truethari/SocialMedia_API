const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Comment } = require("../models/comment");

const middleware = {
    auth,
    isPostIdValid,
    isCommentIdValid,
    isPostAuthorized,
    checkUserExists,
    checkPostExists,
    checkCommentExists,
    isCommentAuthorized,
};

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.get(
    "/",
    middleware.auth,
    async (req, res) => await postController.allPosts(req, res)
);

router.get(
    "/:id",
    [middleware.auth, middleware.isPostIdValid],
    async (req, res) => await postController.singlePost(req, res)
);

router.post(
    "/",
    [middleware.auth, middleware.checkUserExists],
    async (req, res) => await postController.createPost(req, res)
);

router.put(
    "/:id",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.checkPostExists,
        middleware.isPostAuthorized,
    ],
    async (req, res) => await postController.updatePost(req, res)
);

router.delete(
    "/:id",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.checkPostExists,
        middleware.isPostAuthorized,
    ],
    async (req, res) => await postController.deletePost(req, res)
);

router.get(
    "/:id/comments",
    [middleware.auth, middleware.isPostIdValid, middleware.checkPostExists],
    async (req, res) => await commentController.allComments(req, res)
);

router.get(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.isCommentIdValid,
        middleware.checkPostExists,
    ],
    async (req, res) => await commentController.singleComment(req, res)
);

router.post(
    "/:id/comments",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.checkPostExists,
        middleware.checkUserExists,
    ],
    async (req, res) => await commentController.createComment(req, res)
);

router.put(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.isCommentIdValid,
        middleware.checkPostExists,
        middleware.checkCommentExists,
        middleware.isCommentAuthorized,
    ],
    async (req, res) => await commentController.updateComment(req, res)
);

router.delete(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.isPostIdValid,
        middleware.isCommentIdValid,
        middleware.checkPostExists,
        middleware.checkCommentExists,
        middleware.isCommentAuthorized,
    ],
    async (req, res) => await commentController.deleteComment(req, res)
);

async function isPostIdValid(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            msg: "Invalid ID",
        });
    }

    next();
}

async function isCommentIdValid(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
        return res.status(400).json({
            msg: "Invalid ID",
        });
    }

    next();
}

async function isPostAuthorized(req, res, next) {
    const post = await Post.findOne({ _id: req.params.id });

    if (post.userId.localeCompare(req.user._id)) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }

    next();
}

async function isCommentAuthorized(req, res, next) {
    const comment = await Comment.findOne({ _id: req.params.commentId });

    if (comment.userId.localeCompare(req.user._id)) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }

    next();
}

async function checkUserExists(req, res, next) {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
        return res.status(401).json({
            msg: `Invalid token`,
        });
    }

    next();
}

async function checkPostExists(req, res, next) {
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }

    next();
}

async function checkCommentExists(req, res, next) {
    const comment = await Comment.findOne({ _id: req.params.commentId });

    if (!comment) {
        return res.status(404).json({
            msg: `No comment with the id of ${req.params.commentId}`,
        });
    }

    next();
}

module.exports = router;
