const nedb = require("nedb-promises");

const db = nedb.create('diary.jsonl');

exports.addEntry = async (req, res, next) => {

    const entry = req.body;

    // Check if content is provided
    if (!entry.content) {
        return res.status(400).json({
            message: "Missing fields!",
        });
    }

    try {

        entry.user = req.session.user.username;
        entry.timestamp = Date.now();

        await db.insertOne(entry)
        .then((newEntry) => {
            res.status(201).json({
                message: "Diary Entry successfully created",
                diaryEntry: newEntry._id
            });
        });

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.deleteEntry = async (req, res, next) => {
    const { id } = req.params;
    
    try {

        await db.deleteOne({_id: id})
        .then(result => {
            if (result == 0) {

            } else {
                res.status(200).json({
                    message: "Diary Entry successfully deleted."
                });
            }
        });

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.getEntries = async (req, res, next) => {

    try {

        await db.find({user: req.session.user.username})
        .then((entries) => {
            res.status(200).json(entries);
        });

    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};
