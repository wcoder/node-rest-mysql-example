var express = require('express');
var config = require('./config');
var db = require('node-mysql-connect')(config.db);
var router = express.Router();

router.get('/data', function (req, res) {
	db.query('SELECT * from user', function (err, rows) {
		if (err) throw err;

		res.json(rows);
	});
});

module.exports = router;