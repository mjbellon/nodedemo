module.exports = {
	// Development configuration options
	// mongodb://username:password@hostname:port/database
//	db: 'mongodb://localhost/mean-book',

	db: 'postgres://mike:forc4888@localhost/mydb',
	sessionSecret: 'developmentSessionSecret',
	facebook: {
		clientID: 'Application Id',
		clientSecret: 'Application Secret',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Application Id',
		clientSecret: 'Application Secret',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	},
	google: { 
		clientID: 'Application Id', 
		clientSecret: 'Application Secret', 
		callbackURL: 'http://localhost:3000/oauth/google/callback' 
	}
};
