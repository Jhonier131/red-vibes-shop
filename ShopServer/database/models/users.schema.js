const { Schema, model } = require("mongoose");

const users = new Schema(
    {
        fullName: {
            type: String,
            require: true
        },
        documentId: {
            type: Number,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        phone: {
            type: Number,
            require: false
        }
    }
);

const usersSC = model("users", users);
module.exports = {
    usersSC
}