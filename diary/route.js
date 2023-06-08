const express = require('express');
const router = express.Router();

const { addEntry, getEntries, deleteEntry } = require('./diary.js');

router.route('/entries').get(getEntries);
router.route('/entries').post(addEntry);
router.route('/entries/:id').delete(deleteEntry);

module.exports = router;