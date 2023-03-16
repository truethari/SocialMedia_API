const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const { User } = require("../models/user");
const { Post, validate: validatePost } = require("../models/post");
const { Comment, validate: validateComment } = require("../models/comment");
const {
    getNewPostId,
    getNewCommentId,
    incrementPostCreated,
    incrementPostModified,
    incrementPostDeleted,
    incrementCommentCreated,
    incrementCommentModified,
    incrementCommentDeleted,
} = require("../models/data");

const middleware = {
    auth,
    checkUserExists,
    checkPostExists,
    checkCommentExists,
};

router.get("/", async (req, res) => {
    const posts = await Post.find().select("-__v");

    if (!posts) {
        return res.status(404).json({
            msg: "No posts found",
        });
    }

    res.json(posts);
});

router.get("/:id", middleware.auth, async (req, res) => {
    const post = await Post.findOne({ postId: req.params.id }).select("-__v");

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }

    res.json(post);
});

router.post(
    "/",
    [middleware.auth, middleware.checkUserExists],
    async (req, res) => {
        const { error } = validatePost(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        let post = new Post({
            postId: await getNewPostId(),
            userId: req.body.userId,
            title: req.body.title,
            body: req.body.body,
        });

        post = await post.save();

        await incrementPostCreated();

        res.json(post);
    }
);

router.put(
    "/:id",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        if (!req.body.title && !req.body.body) {
            return res.status(400).json({
                msg: "Please include a title or body",
            });
        }

        if (req.body.title) {
            const { error } = validatePost(req.body, ["userId", "body"]);

            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const result = await Post.updateOne(
                { postId: req.params.id },
                { title: req.body.title }
            );

            if (!result) {
                return res.status(500).json({
                    msg: "Something went wrong",
                });
            }
        }

        if (req.body.body) {
            const { error } = validatePost(req.body, ["userId", "title"]);

            if (error) {
                return res.status(400).send(error.details[0].message);
            }

            const result = await Post.updateOne(
                { postId: req.params.id },
                { body: req.body.body }
            );

            if (!result) {
                return res.status(500).json({
                    msg: "Something went wrong",
                });
            }
        }

        await incrementPostModified();

        res.json({
            msg: "Post updated",
        });
    }
);

router.delete(
    "/:id",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const result = await Post.deleteOne({ postId: req.params.id });

        if (!result.deletedCount) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }

        await incrementPostDeleted();

        res.json({
            msg: "Post deleted",
        });
    }
);

router.get(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const comments = await Comment.find().select("-__v");

        if (!comments) {
            return res.status(404).json({
                msg: `No comments with the post id of ${req.params.id}`,
            });
        }

        res.json(comments);
    }
);

router.get(
    "/:id/comments/:commentId",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const comment = await Comment.findOne({
            commentId: req.params.commentId,
        }).select("-__v");

        if (!comment) {
            return res.status(404).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }

        res.json(comment);
    }
);

router.post(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists, middleware.checkUserExists],
    async (req, res) => {
        const { error } = validateComment(req.body, ["postId"]);

        if (error) {
            return res.status(400).send({ msg: error.details[0].message });
        }

        let comment = new Comment({
            commentId: await getNewCommentId(),
            postId: req.params.id,
            userId: req.body.userId,
            post: req.params.id,
            body: req.body.body,
        });

        comment = await comment.save();

        await incrementCommentCreated();

        res.json(comment);
    }
);

router.put(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    async (req, res) => {
        const { error } = validateComment(req.body, [
            "userId",
            "postId",
            "commentId",
        ]);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const result = await Comment.updateOne(
            { commentId: req.params.commentId },
            { body: req.body.body }
        );

        if (!result) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }

        await incrementCommentModified();

        res.json({
            msg: "Comment updated",
        });
    }
);

router.delete(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    async (req, res) => {
        const result = await Comment.deleteOne({
            commentId: req.params.commentId,
        });

        if (!result.deletedCount) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        }

        await incrementCommentDeleted();

        res.json({
            msg: "Comment deleted",
        });
    }
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
