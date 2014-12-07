var passport = require('passport'), 
	User = require('../app/models/user.server.model');
	
module.exports = function() {

	passport.serializeUser(function(user, done) {
		done(null, user.id); 
	}); 
	
	passport.deserializeUser(function(id, done) {
		User.findOne({ id: id 	}, '-password -salt', function( err, user) {
			done(err, user);
		}); 
	}); 

	require('./strategies/local.js')(); 
	require('./strategies/facebook.js')();
	require('./strategies/twitter.js')(); 
	require('./strategies/google.js')();

};
