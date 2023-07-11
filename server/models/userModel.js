const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "Username is required!"],
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
        },
        bio: {
            type: String,
        },
        profilePic: {
            url: {
                type: String,
            },
            id: {
                type: String,
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);