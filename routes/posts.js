const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const { validatePost, validateComment } = require("../utils/validations");
const sqlCommand = require("../utils/db");

const middleware = {
    auth,
    checkPostExists,
    checkCommentExists,
};

router.get("/", async (req, res) => {
    const posts = await sqlCommand("SELECT * FROM posts;");

    if (!posts.length) {
        return res.status(404).json({
            msg: "No posts found",
        });
    } else {
        res.json(posts);
    }
});

router.get("/:id", middleware.auth, async (req, res) => {
    const posts = await sqlCommand("SELECT * FROM posts WHERE id=?;", [
        req.params.id,
    ]);

    if (!posts.length) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    } else {
        res.json(posts);
    }
});

router.post("/", auth, async (req, res) => {
    const { error } = validatePost(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const cmd = await sqlCommand(
        "INSERT INTO posts (user, title, body) VALUES (?, ?, ?);",
        [req.body.user, req.body.title, req.body.body]
    );

    if (!cmd.affectedRows) {
        return res.status(404).json({
            msg: `something went wrong`,
        });
    }

    const post = await sqlCommand("SELECT * FROM posts WHERE id=?;", [
        cmd.insertId,
    ]);

    res.json(post[0]);
});

router.put(
    "/:id",
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const { error } = validatePost(req.body, ["user", "body", "title"]);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        if (!req.body.title && !req.body.body) {
            return res.status(400).json({
                msg: "Please include a title or body",
            });
        }

        let cmd;

        if (!req.body.title) {
            cmd = await sqlCommand("UPDATE posts SET body = ? WHERE id = ?;", [
                req.body.body,
                req.params.id,
            ]);
        } else if (!req.body.body) {
            cmd = await sqlCommand("UPDATE posts SET title = ? WHERE id = ?;", [
                req.body.title,
                req.params.id,
            ]);
        }

        if (!cmd.affectedRows) {
            return res.status(404).json({
                msg: `No post with the id of ${req.params.id}`,
            });
        }

        const post = await sqlCommand("SELECT * FROM posts WHERE id=?;", [
            req.params.id,
        ]);

        res.json(post);
    }
);

router.delete("/:id", middleware.auth, async (req, res) => {
    const cmd = await sqlCommand("DELETE FROM posts WHERE id=?;", [
        req.params.id,
    ]);

    if (!cmd.affectedRows) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    } else {
        return res.json({ msg: "Post deleted" });
    }
});

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
    [middleware.auth, middleware.checkPostExists],
    async (req, res) => {
        const { error } = validateComment(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const cmd = await sqlCommand(
            "INSERT INTO comments (post, user, body) VALUES (?, ?, ?);",
            [req.params.id, req.body.user, req.body.body]
        );

        if (!cmd.affectedRows) {
            return res.status(404).json({
                msg: `something went wrong`,
            });
        }

        const comment = await sqlCommand("SELECT * FROM comments WHERE id=?;", [
            cmd.insertId,
        ]);

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

        if (!cmd.affectedRows) {
            return res.status(404).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }

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
        const cmd = await sqlCommand("DELETE FROM comments WHERE id=?;", [
            req.params.commentId,
        ]);

        if (!cmd.affectedRows) {
            return res.status(404).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }
        res.json({
            msg: "Comment deleted",
        });
    }
);

async function checkPostExists(req, res, next) {
    const post = await sqlCommand("SELECT * FROM posts WHERE id=?;", [
        req.params.id,
    ]);

    if (!post.length) {
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
