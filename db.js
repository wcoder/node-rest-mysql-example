var mysql = require('mysql');
var config = require('./config.js');
var connection;

function startConnection () {
	if (connection !== null && connection.state !== 'disconnected') return;

	connection = mysql.createConnection({
		host: config.dbHost,
		user: config.dbUser,
		password: config.dbPassword,
		database: config.dbName
	});

	// The server is either down
	// or restarting (takes a while sometimes).
	connection.connect(function (err) {
		console.log('MYSQL [connected].');

		if (err) {
			console.log('MYSQL [error]:', err);

			if (err.code === 'ECONNREFUSED') {
				console.log('MYSQL [server not found].');
			} else {
				// We introduce a delay before attempting to reconnect,
				// to avoid a hot loop, and to allow our node script to
				// process asynchronous requests in the meantime.
				// If you're also serving http, display a 503 error.
				setTimeout(startConnection, 2000);
			}
		}
	});

	connection.on('error', function (err) {
		console.log('MYSQL [error]:', err);

		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.log('MYSQL [disconected].');

			// Connection to the MySQL server is usually
			// lost due to either server restart, or a
			// connnection idle timeout (the wait_timeout
			// server variable configures this)
			startConnection();
		} else {
			throw err;
		}
	});
}


startConnection();

module.exports = {
	connection: connection,
	query: function (sql, callback) {
		startConnection();

		if (connection.state !== 'disconnected') {
			console.log('MYSQL [query]: %s', sql);

			connection.query(sql, callback);
		} else {
			callback(new Error('MYSQL [no connection]'));
		}
	}
};
