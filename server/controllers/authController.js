const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const Socials = require("../models/socialsModel");

const generateToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const user = await User.findOne({ username });

    if (user) {
        res.status(403);
        throw new Error("Username already exist!");
    }

    if (password.length < 8) {
        res.status(400);
        throw new Error("Password must be greater than 8 characters");
    }

    if (password !== confirmPassword) {
        res.status(403);
        throw new Error("Password incorrect!");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
        username,
        password: hashedPassword,
        bio: "Bio",
    });

    const userDetails = {
        username: newUser.username,
        _id: newUser._id,
        bio: newUser.bio,
    };

    // create instant document for socials accounts
    await Socials.create({
        creator: newUser._id,
    });

    res.status(201).json({
        user: userDetails,
        token: generateToken(newUser._id),
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        res.status(403);
        throw new Error("User doesn't exist");
    }

    const userDetails = {
        username: user.username,
        _id: user._id,
    };

    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            user: userDetails,
            token: generateToken(user._id),
        });
    } else {
        res.status(404);
        throw new Error("Incorrect email or password");
    }
});

module.exports = { registerUser, loginUser };
