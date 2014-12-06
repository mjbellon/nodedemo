/**
 * New node file
 */
var express = require('express'); 

var app = express(); 
app.use('/', function( req, res) { 
	res.send('Hello World'); 
	}); 
var listener = app.listen(1337); 
console.log('Server running somewhere at ' + listener.address().address); 
console.log(server.address().port);

module.exports = app;
