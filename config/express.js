var config = require('./config'),
//	http = require('http'),
//	socketio = require('socket.io'),
	express = require('express'), 
	morgan = require('morgan'), 
	compress = require('compression'), 
	bodyParser = require('body-parser'), 
	methodOverride = require('method-override'),
	session = require('express-session'),
	pgSession = require('connect-pg-simple')(session),
	pg = require('pg'),
	flash = require('connect-flash'),
	passport = require('passport');
	
module.exports = function(db) {
	var app = express(); 
	
//	var server = http.createServer(app);
//	var io = socketio.listen(server);

	if (process.env.NODE_ENV === 'development') { 
		app.use(morgan('dev')); 
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress()); 
	}
	
	app.use(bodyParser.urlencoded({ 
		extended: true 
	})); 
	app.use(bodyParser.json()); 
	app.use(methodOverride());
	
	// Use PostgreSQL as the store for the user session cookie
	app.use( session({
		store: new pgSession({
			pg : pg,
			conString : config.db,
			tableName : 'session'
		}),
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
	}));

	app.set('views', './app/views'); 
	app.set('view engine', 'ejs');
	
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);
//	require('../app/routes/articles.server.routes.js')(app);
	
	app.use(express.static('./public'));

//	require('./socketio')( server, io, mongoStore);
	return app;
};