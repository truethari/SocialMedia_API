const Joi = require("joi");
const mongoose = require("mongoose");

const Counter = mongoose.model(
    "Counter",
    new mongoose.Schema({
        users: { type: Number, default: 0 },
        posts: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
    })
);

async function increaseUsersCounter() {
    const collections = await mongoose.connection.db
        .listCollections({ name: "users" })
        .toArray();

    const names = collections.map((collection) => collection.name);
    console.log(names);

    if (!names.includes("users")) {
        const counters = new Counter({
            users: 1,
            posts: 0,
            comments: 0,
        });
        console.log("users counter created");
        await counters.save();
        return;
    }

    Counter.findOneAndUpdate(
        { users: { $exists: true } },
        { $inc: { posts: 1 } }
    );

    // const counters = await Counter.updateOne({
    //     users: { $exists: true },
    //     $set: { users: 1 },
    // });
    // console.log(counters);
    // counters.users++;
    // await counters.save();
}

module.exports.increaseUsersCounter = increaseUsersCounter;
