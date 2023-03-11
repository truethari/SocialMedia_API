const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.use(express.json());

const posts = require("../assets/data/posts.json");
const comments = require("../assets/data/comments.json");

router.get("/", (req, res) => {
    res.json(posts);
});

router.get("/:id", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        res.json(posts.filter((post) => post.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.post("/", (req, res) => {
    const { error } = validatePost(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const newPost = {
        id: posts.length + 1,
        user: req.body.user,
        body: req.body.body,
        tags: req.body.tags,
    };

    posts.push(newPost);
    res.json(posts);
});

router.put("/:id", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        const { error } = validatePost(req.body);

        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const updatedPost = req.body;
        posts.forEach((post) => {
            if (post.id === parseInt(req.params.id)) {
                post.user = updatedPost.user ? updatedPost.user : post.user;
                post.body = updatedPost.body ? updatedPost.body : post.body;
                post.tags = updatedPost.tags ? updatedPost.tags : post.tags;

                res.json({
                    msg: "Post updated",
                    post,
                });
            }
        });
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.delete("/:id", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        res.json({
            msg: "Post deleted",
            posts: posts.filter((post) => post.id !== parseInt(req.params.id)),
        });
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.get("/:id/comments", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        res.json(
            comments.filter(
                (comment) => comment.post === parseInt(req.params.id)
            )
        );
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.get("/:id/comments/:commentId", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        const comment = comments.filter(
            (comment) =>
                comment.post === parseInt(req.params.id) &&
                comment.id === parseInt(req.params.commentId)
        );

        if (comment.length > 0) {
            res.json(comment);
        } else {
            res.status(400).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.post("/:id/comments", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        const newComment = {
            id: comments.length + 1,
            post: parseInt(req.params.id),
            user: req.body.user,
            body: req.body.body,
        };

        comments.push(newComment);
        res.json(comments);
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.put("/:id/comments/:commentId", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        const comment = comments.filter(
            (comment) =>
                comment.post === parseInt(req.params.id) &&
                comment.id === parseInt(req.params.commentId)
        );

        if (comment.length > 0) {
            const updatedComment = req.body;
            comments.forEach((comment) => {
                if (
                    comment.post === parseInt(req.params.id) &&
                    comment.id === parseInt(req.params.commentId)
                ) {
                    comment.user = updatedComment.user
                        ? updatedComment.user
                        : comment.user;
                    comment.body = updatedComment.body
                        ? updatedComment.body
                        : comment.body;

                    res.json({
                        msg: "Comment updated",
                        comment,
                    });
                }
            });
        } else {
            res.status(400).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

router.delete("/:id/comments/:commentId", (req, res) => {
    const found = posts.some((post) => post.id === parseInt(req.params.id));

    if (found) {
        const comment = comments.filter(
            (comment) =>
                comment.post === parseInt(req.params.id) &&
                comment.id === parseInt(req.params.commentId)
        );

        if (comment.length > 0) {
            res.json({
                msg: "Comment deleted",
                comments: comments.filter(
                    (comment) =>
                        comment.post !== parseInt(req.params.id) &&
                        comment.id !== parseInt(req.params.commentId)
                ),
            });
        } else {
            res.status(400).json({
                msg: `No comment with the id of ${req.params.commentId}`,
            });
        }
    } else {
        res.status(400).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }
});

function validatePost(post) {
    const schema = Joi.object({
        id: Joi.number().min(3).required(),
        user: Joi.number().min(3).required(),
        body: Joi.string().min(3).required(),
        tags: Joi.array().items(Joi.string()),
    });

    return schema.validate(post);
}

module.exports = router;
