var mysql = require('mysql');
var config = require('./config.js');
var connection = mysql.createConnection({
	host: config.dbHost,
	user: config.dbUser,
	password: config.dbPassword,
	database: config.dbName
});

module.exports = {
	connection: connection,
	query: function (sql, callback) {
		console.log('MYSQL: %s', sql);

		connection.query(sql, callback);
	}
};
