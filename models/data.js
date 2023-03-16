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

    await incrementUserCreated();
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

module.exports.getNewUserId = getNewUserId;
