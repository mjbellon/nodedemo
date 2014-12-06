/**
 * New node file
 */
var express = require('express'); 


var app = express(); 
app.set('domain', 'http://54.149.107.120/');

app.use('/', function( req, res) { 
	res.send('Hello World'); 
	}); 
var listener = app.listen(1337); 
console.log('Server running somewhere at ' + listener.address().address); 
console.log(listener.address().port);

module.exports = app;
