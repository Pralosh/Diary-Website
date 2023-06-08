const nedb = require("nedb-promises");
const bcrypt = require("bcrypt");

const db = nedb.create('users.jsonl');

exports.login = async (req, res, next) => {
    
    const { username, password } = req.body;

    // Check if username and password is provided
    if (!username || !password) {
        return res.status(400).json({
            message: "Username or Password not present",
        });
    }

    try {
        const user = await db.findOne({ username });

        if (!user) {
            res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            });
        } else {
            // comparing given password with hashed password
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    req.session.user = user;
                    req.session.save();
                    res.status(200).json({
                        message: "User successfully Logged in",
                        user: user._id
                    });
                } else {
                    res.status(400).json({ message: "Login not succesful" });
                }
            });
        }
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.register = async (req, res, next) => {

    const user = req.body;

    // Check if username and password is provided
    if (!user.username || !user.password || !user.name || !user.email) {
        return res.status(400).json({
            message: "Missing fields!",
        });
    }

    if (user.password.length < 6) {
        return res.status(400).json({ message: "Password less than 6 characters" });
    }

    try {

        const userExist = await db.findOne({ username: user.username });

        if (userExist) {
            res.status(400).json({
                message: "User registration failed!",
                error: "User already exists.",
            });
        } else {
            bcrypt.hash(user.password, 10).then(async (hash) => {

                user.password = hash;
                await db.insertOne(user)
                .then((newUser) => {
                    req.session.user = newUser;
                    req.session.save();
                    res.status(201).json({
                        message: "User successfully created",
                        user: newUser._id
                    });
                })

            });
        }

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.update = async (req, res, next) => {
    const user = req.body;

    if (!user.username || !user.name || !user.email) {
        return res.status(400).json({
            message: "Missing fields!",
        });
    }

    try {
        const userExist = await db.findOne({ username: user.username });

        if (userExist) {
            userExist.name = user.name;
            userExist.email = user.email;

            await db.updateOne({username: user.username}, {$set: userExist})
            .then((userUpdate) => {
                req.session.user = userUpdate;
                req.session.save();
                res.status(200).json({
                    message: "User profile successfully updated.",
                    user: userUpdate._id
                });
            })            
        }

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};