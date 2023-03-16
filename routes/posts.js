const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { validateComment } = require("../utils/validations");
const { Post, validate } = require("../models/post");
const {
    getNewPostId,
    incrementPostCreated,
    incrementPostModified,
} = require("../models/data");
const { User } = require("../models/user");
const sqlCommand = require("../utils/db");

const middleware = {
    auth,
    checkUserExists,
    checkPostExists,
    checkCommentExists,
};

router.get("/", async (req, res) => {
    const posts = await Post.findOne().select("-__v");

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
        const { error } = validate(req.body);

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
            const { error } = validate(req.body, ["userId", "body"]);

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
            const { error } = validate(req.body, ["userId", "title"]);

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
        const cmd = await sqlCommand("DELETE FROM posts WHERE id=?;", [
            req.params.id,
        ]);

        if (!cmd.affectedRows) {
            return res.status(500).json({
                msg: "Something went wrong",
            });
        } else {
            return res.json({ msg: "Post deleted" });
        }
    }
);

router.get(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const comments = await sqlCommand(
            "SELECT * FROM comments WHERE post=?;",
            [req.params.id]
        );

        if (!comments.length) {
            return res.status(404).json({
                msg: `No comments with the post id of ${req.params.id}`,
            });
        } else {
            return res.json(comments);
        }
    }
);

router.get(
    "/:id/comments/:commentId",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const comment = await sqlCommand(
            "SELECT * FROM comments WHERE id=? AND post=?;",
            [req.params.commentId, req.params.id]
        );

        if (!comment.length) {
            return res.status(404).json({
                msg: `No comments with the post id of ${req.params.id}`,
            });
        } else {
            return res.json(comment);
        }
    }
);

router.post(
    "/:id/comments",
    [middleware.auth, middleware.checkUserExists, middleware.checkPostExists],
    async (req, res) => {
        const { error } = validateComment(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

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
        const { error } = validateComment(req.body, ["user"]);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const cmd = await sqlCommand(
            "UPDATE comments SET body = ? WHERE id = ?;",
            [req.body.body, req.params.commentId]
        );

        const comment = await sqlCommand("SELECT * FROM comments WHERE id=?;", [
            req.params.id,
        ]);

        res.json(comment);
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
        await sqlCommand("DELETE FROM comments WHERE id=?;", [
            req.params.commentId,
        ]);

        res.json({
            msg: "Comment deleted",
        });
    }
);

async function checkUserExists(req, res, next) {
    const user = await User.findOne({ userId: req.body.userId });

    if (!user) {
        return res.status(404).json({
            msg: `No user with the id of ${req.body.userId}`,
        });
    } else {
        next();
    }
}

async function checkPostExists(req, res, next) {
    const post = await Post.findOne({ postId: req.params.id });

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    } else {
        next();
    }
}

async function checkCommentExists(req, res, next) {
    const comment = await sqlCommand(
        "SELECT * FROM comments WHERE id=? AND post=?;",
        [req.params.commentId, req.params.id]
    );

    if (!comment.length) {
        return res.status(404).json({
            msg: `No comment with the id of ${req.params.commentId}`,
        });
    } else {
        next();
    }
}

module.exports = router;
