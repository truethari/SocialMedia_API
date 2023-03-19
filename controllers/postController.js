const { Post, validate } = require("../models/post");
const data = require("../models/data");

exports.allPosts = async (req, res) => {
    const posts = await Post.find().select("-__v");

    if (!posts) {
        return res.status(404).json({
            msg: "No posts found",
        });
    }

    res.json(posts);
};

exports.singlePost = async (req, res) => {
    const post = await Post.findOne({ postId: req.params.id }).select("-__v");

    if (!post) {
        return res.status(404).json({
            msg: `No post with the id of ${req.params.id}`,
        });
    }

    res.json(post);
};

exports.createPost = async (req, res) => {
    const { error } = validate(req.body, ["userId"]);

    if (error) {
        return res.status(400).send({ msg: error.details[0].message });
    }

    let post = new Post({
        postId: await data.getNewPostId(),
        userId: req.body.userId,
        title: req.body.title,
        body: req.body.body,
    });

    post = await post.save();

    await data.incrementPostCreated();

    res.json(post);
};

exports.updatePost = async (req, res) => {
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

    await data.incrementPostModified();

    res.json({
        msg: "Post updated",
    });
};

exports.deletePost = async (req, res) => {
    const result = await Post.deleteOne({ postId: req.params.id });

    if (!result) {
        return res.status(500).json({
            msg: "Something went wrong",
        });
    }

    await data.incrementPostDeleted();

    res.json({
        msg: "Post deleted",
    });
};
