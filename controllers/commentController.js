const { Comment, validate } = require("../models/comment");

const data = require("../models/data");

exports.allComments = async (req, res) => {
    const comments = await Comment.find().select("-__v");

    if (!comments) {
        return res.status(404).json({
            msg: `No comments with the post id of ${req.params.id}`,
        });
    }

    res.json(comments);
};

exports.singleComment = async (req, res) => {
    const comments = await Comment.find({
        commentId: req.params.commentId,
    }).select("-__v");

    if (!comments.length) {
        return res.status(404).json({
            msg: `No comments with the post id of ${req.params.id}`,
        });
    }

    res.json(comments);
};

exports.createComment = async (req, res) => {
    const { error } = validate(req.body, ["postId"]);

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

    await data.incrementCommentCreated();

    res.json(comment);
};

exports.updateComment = async (req, res) => {
    const { error } = validate(req.body, ["userId", "postId", "commentId"]);

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

    await data.incrementCommentModified();

    res.json({
        msg: "Comment updated",
    });
};

exports.deleteComment = async (req, res) => {
    const result = await Comment.deleteOne({
        commentId: req.params.commentId,
    });

    if (!result.deletedCount) {
        return res.status(500).json({
            msg: "Something went wrong",
        });
    }

    await data.incrementCommentDeleted();

    res.json({
        msg: "Comment deleted",
    });
};
