const express = require("express");
const Joi = require("joi");
const router = express.Router();

router.use(express.json());

const posts = require("../assets/data/posts.json");

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
