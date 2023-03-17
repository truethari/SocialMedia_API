const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Post } = require("../models/post");
const { Comment } = require("../models/comment");

const middleware = {
    auth,
    checkUserExists,
    checkPostExists,
    checkCommentExists,
};

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");

router.get("/", async (req, res) => await postController.allPosts(req, res));

router.get(
    "/:id",
    middleware.auth,
    async (req, res) => await postController.singlePost(req, res)
);

router.post(
    "/",
    [middleware.auth, middleware.checkUserExists],
    async (req, res) => await postController.createPost(req, res)
);

router.put(
    "/:id",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => await postController.updatePost(req, res)
);

router.delete(
    "/:id",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => await postController.deletePost(req, res)
);

router.get(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => await commentController.allComments(req, res)
);

router.get(
    "/:id/comments/:commentId",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => await commentController.singleComment(req, res)
);

router.post(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists, middleware.checkUserExists],
    async (req, res) => await commentController.createComment(req, res)
);

router.put(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    async (req, res) => await commentController.updateComment(req, res)
);

router.delete(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    async (req, res) => await commentController.deleteComment(req, res)
);

async function checkUserExists(req, res, next) {
    if (!req.body.userId) {
        return res.status(400).json({
            msg: "Please include a userId",
        });
    }

    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
        return res.status(404).json({
            msg: `No user with the id of ${req.body.userId}`,
        });
    }

    next();
}

async function checkPostExists(req, res, next) {
    const post = await Post.findOne({ postId: req.params.id });

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }

    next();
}

async function checkCommentExists(req, res, next) {
    const comment = await Comment.findOne({ commentId: req.params.commentId });

    if (!comment) {
        return res.status(404).json({
            msg: `No comment with the id of ${req.params.commentId}`,
        });
    }

    next();
}

module.exports = router;
