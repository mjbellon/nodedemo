/**
 * main node start file
 */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var pg = require('./config/pg'),
	express = require('./config/express'),
	passport = require('./config/passport');

//var db = mongoose();
var db = pg();
var app = express(db);
var passport = passport();

app.listen(1337); 

module.exports = app;
console.log('Server running at http://localhost:1337/');
