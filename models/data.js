const mongoose = require("mongoose");

const stats = mongoose.Schema({
    about: String,
    created: Number,
    deleted: Number,
    modified: Number,
});

const Stats = mongoose.model("Data", stats);

async function createFirst() {
    return await Stats.insertMany([
        { about: "users", created: 0, deleted: 0, modified: 0 },
        { about: "posts", created: 0, deleted: 0, modified: 0 },
        { about: "comments", created: 0, deleted: 0, modified: 0 },
    ]);
}

async function getNewUserId() {
    const result = await Stats.findOne({ about: "users" });

    if (!result) {
        await createFirst();
        return await getNewUserId();
    }

    return result.created + 1;
}

async function getNewPostId() {
    const result = await Stats.findOne({ about: "posts" });

    if (!result) {
        await createFirst();
        return await getNewPostId();
    }

    return result.created + 1;
}

async function getNewCommentId() {
    const result = await Stats.findOne({ about: "comments" });

    if (!result) {
        await createFirst();
        return await getNewCommentId();
    }

    return result.created + 1;
}

async function incrementUserCreated() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "users",
        },
        { $inc: { created: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementUserCreated();
    }
}

async function incrementUserModified() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "users",
        },
        { $inc: { modified: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementUserModified();
    }
}

async function incrementUserDeleted() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "users",
        },
        { $inc: { deleted: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementUserDeleted();
    }
}

async function incrementPostCreated() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "posts",
        },
        { $inc: { created: 1 } }
    );

    if (!result) {
        await createFirst();
        return await increasePostsCounter();
    }
}

async function incrementPostModified() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "posts",
        },
        { $inc: { modified: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementPostModified();
    }
}

async function incrementPostDeleted() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "posts",
        },
        { $inc: { deleted: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementPostDeleted();
    }
}

async function incrementCommentCreated() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "comments",
        },
        { $inc: { created: 1 } }
    );

    if (!result) {
        await createFirst();
        return await increaseCommentsCounter();
    }
}

async function incrementCommentModified() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "comments",
        },
        { $inc: { modified: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementCommentModified();
    }
}

async function incrementCommentDeleted() {
    const result = await Stats.findOneAndUpdate(
        {
            about: "comments",
        },
        { $inc: { deleted: 1 } }
    );

    if (!result) {
        await createFirst();
        return await incrementCommentDeleted();
    }
}

module.exports.getNewUserId = getNewUserId;
module.exports.getNewPostId = getNewPostId;
module.exports.getNewCommentId = getNewCommentId;
module.exports.incrementUserCreated = incrementUserCreated;
module.exports.incrementUserModified = incrementUserModified;
module.exports.incrementUserDeleted = incrementUserDeleted;
module.exports.incrementPostCreated = incrementPostCreated;
module.exports.incrementPostModified = incrementPostModified;
module.exports.incrementPostDeleted = incrementPostDeleted;
module.exports.incrementCommentCreated = incrementCommentCreated;
module.exports.incrementCommentModified = incrementCommentModified;
module.exports.incrementCommentDeleted = incrementCommentDeleted;
