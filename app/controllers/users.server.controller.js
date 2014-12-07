var User = require('../models/user.server.model'),
	passport = require('passport'); 

// DB Neutral
var getErrorMessage = function(err) {
	var message = ''; 
	if (err.code) { 
		switch (err.code) {
			case 11000: 
			case 11001: 
				message = 'Username already exists'; 
				break; 
			default: 
				message = 'Something went wrong'; 
		} 
	} else { 
		for (var errName in err.errors) { 
			if (err.errors[errName].message) message = err.errors[errName].message; 
		}
	} 
	
	return message; 
}; 

// Render the Signin form - Guard of req.user not NULL - DB Neutral
exports.renderSignin = function(req, res, next) {
	if (!req.user) {
		res.render('signin', {
			title: 'Sign-in Form', 
			messages: req.flash('error') || req.flash('info') 
		});
	} else { 
		return res.redirect('/'); 
	} 
}; 

// Render the Signup form - Guard of req.user not NULL - DB Neutral
exports.renderSignup = function(req, res, next) {
	if (!req.user) {
		res.render('signup', { 
			title: 'Sign-up Form', 
			messages: req.flash('error') 
		}); 
	} else { 
		return res.redirect('/'); 
	}
};

// Log the user out - DB Neutral
exports.signout = function( req, res) {
	req.logout();
	res.redirect('/');
};

// Check for authenticated user otherwise error - guard in some routes... - DB Neutral
exports.requiresLogin = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}

	next();
};

// Uses new User(), provider param, user.save - DB Required
exports.signup = function( req, res, next) { 
	if (!req.user) { 
		var user = new User(req.body);
		var message = null; 
		user.provider = 'local'; 
		user.save(function(err) {
			if (err) { 
				var message = getErrorMessage( err);
				req.flash('error', message); 
				return res.redirect('/signup'); 
			} 
			req.login(user, function(err) {
				if (err) return next( err); 
				return res.redirect('/');
			});
		}); 
	} else { 
		return res.redirect('/'); 
	} 
	
};

// Uses User.findOne(provider, providerID), if not found, User.findUniqueUsername, new User (profile), user.save - DB Required
exports.saveOAuthUserProfile = function( req, profile, done) { 
	User.User.findOne({
		provider: profile.provider, 
		providerId: profile.providerId 
	}, function( err, user) { 
		if (err) { 
			return done( err); 
		} else { 
			if (!user) { // add the user
				var possibleUsername = profile.username || (( profile.email) ? profile.email.split('@')[0] : '');
				User.findUniqueUsername(possibleUsername, null, function( availableUsername) {
					profile.username = availableUsername; 
					user = new User.User( profile);
					user.save(function(err) {
						if (err) {
							var message = _this.getErrorMessage(err);
							req.flash('error', message);
							return res.redirect('/signup');
						}
						return done(err, user);
					}); 
				}); 
			} else { 
				return done(err, user); // User authenticated
			}
		}
	});
};


/* 
exports.list = function( req, res, next) { 
	User.find({}, function( err, users) { 
		if (err) {
			return next( err); 
		} else { 
			res.json(users); 
		} 
	}); 
};

exports.create = function(req, res, next) { 
//	console.log(req.body);
	var user = new User(req.body); 
	
	user.save(function(err) {
		if (err) {
			return next(err);
		} else { 
			res.json(user); 
		} 
	}); 
};

exports.read = function(req, res) { 
	res.json(req.user);
}; 

exports.userByID = function(req, res, next, id) { 
	User.findOne({
		_id: id 
		}, function(err, user) { 
			if (err) { 
				return next(err); 
			} else { 
				req.user = user; 
				next(); 
			}
		});
};

exports.update = function( req, res, next) { 
	User.findByIdAndUpdate( req.user.id, req.body, function( err, user) { 
		if (err) { 
			return next( err); 
		} else { 
			res.json( user); 
		}
	});
};

exports.delete = function(req, res, next) { 
	req.user.remove( function(err) { 
		if (err) { 
			return next(err); 
		} else { 
			res.json(req.user); 
		} 
	})
};

 */