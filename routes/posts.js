const express = require("express");
const Joi = require("joi");
const router = express.Router();
const auth = require("../middleware/auth");

const posts = require("../assets/data/posts.json");
const comments = require("../assets/data/comments.json");

router.get("/", (req, res) => {
    res.json(posts);
});

const middleware = {
    auth,
    checkPostExists,
    checkCommentExists,
};

router.get("/:id", auth, checkPostExists, (req, res) => {
    checkPostExists(req, res);

    res.json(posts.filter((post) => post.id === parseInt(req.params.id)));
});

router.post("/", auth, (req, res) => {
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

router.put("/:id", auth, (req, res) => {
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
});

router.delete("/:id", auth, checkPostExists, (req, res) => {
    res.json({
        msg: "Post deleted",
        posts: posts.filter((post) => post.id !== parseInt(req.params.id)),
    });
});

router.get(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists],
    (req, res) => {
        res.json(
            comments.filter(
                (comment) => comment.post === parseInt(req.params.id)
            )
        );
    }
);

router.get(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    (req, res) => {
        const comment = comments.filter(
            (comment) =>
                comment.post === parseInt(req.params.id) &&
                comment.id === parseInt(req.params.commentId)
        );

        res.json(comment);
    }
);

router.post(
    "/:id/comments",
    [middleware.auth, middleware.checkPostExists],
    (req, res) => {
        const newComment = {
            id: comments.length + 1,
            post: parseInt(req.params.id),
            user: req.body.user,
            body: req.body.body,
        };

        comments.push(newComment);
        res.json(comments);
    }
);

router.put(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    (req, res) => {
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
    }
);

router.delete(
    "/:id/comments/:commentId",
    [
        middleware.auth,
        middleware.checkPostExists,
        middleware.checkCommentExists,
    ],
    (req, res) => {
        res.json({
            msg: "Comment deleted",
            comments: comments.filter(
                (comment) =>
                    comment.post !== parseInt(req.params.id) &&
                    comment.id !== parseInt(req.params.commentId)
            ),
        });
    }
);

function validatePost(post) {
    const schema = Joi.object({
        id: Joi.number().min(3).required(),
        user: Joi.number().min(3).required(),
        body: Joi.string().min(3).required(),
        tags: Joi.array().items(Joi.string()),
    });

    return schema.validate(post);
}

function checkPostExists(req, res, next) {
    const post = posts.find((post) => post.id === parseInt(req.params.id));

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    } else {
        next();
    }
}

function checkCommentExists(req, res, next) {
    const comment = comments.find(
        (comment) =>
            comment.post === parseInt(req.params.id) &&
            comment.id === parseInt(req.params.commentId)
    );

    if (!comment) {
        return res.status(404).json({
            msg: `No comment with the id of ${req.params.commentId}`,
        });
    } else {
        next();
    }
}

module.exports = router;
