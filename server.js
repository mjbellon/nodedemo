/**
 * New node file
 */
var express = require('express'); 

var app = express(); 
app.use('/', function( req, res) { 
	res.send('Hello World'); 
	}); 
app.listen(1337); 
console.log('Server running at http://localhost: 1337/'); 

module.exports = app;
