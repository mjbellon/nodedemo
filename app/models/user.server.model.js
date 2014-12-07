/**
 * Created by Mike on 11/3/2014.
 */
var pg = require('pg'),
    crypto = require('crypto');
    pg1 = require('../../config/pg.js');

function UserSchema(profile) {

    var _password, _email;

    console.log('In user.server.model.js UserSchema constructor');

    this.firstname = profile.firstname;      // String
    this.lastname = profile.lastname;        // String
    this.username = profile.username;        // {type: String, unique: true, required: 'User name is required', trim: true}
    this.salt = profile.salt;                // {type: String}
    this.provider = profile.provider;        // {type: String, required: 'Provider is required'}
    this.providerId = profile.providerId ? profile.providerId : "";    // String,
    this.providerData = profile.providerData ? profile.providerData : "";
    if (profile.created)
        this.created = profile.created;
    else
        this.created = Date.now();

    if (profile.id)
        this.id = profile.id;

    // {type: String, validate: [function(password) {return password && password.length > 6;}, 'Password should be longer']}
    function setPassword(password) {
        if ((!password) || (password.length < 6))
            throw new Error("Password should be longer than 5 characters");
        else
            _password = password;
    }

    function getPassword() {
        return _password;
    }

    // {type: String, match: [/.+\@.+\..+/, "Please fill a valid email address"]}
    function setEmail(email) {
        if (!email.match(/.+\@.+\..+/))
            throw new Error("Please fill a valid email address");
        else
            _email = email;
    }

    function getEmail() {
        return _email;
    }

    function setFullName(fullName) {
        var splitName = fullName.split(' ');
        firstname = splitName[0] || '';
        lastname = splitName[1] || '';
    }

    function getFullName() {
        return this.firstname + ' ' + this.lastname;
    }

    // Create enumerable, nonconfigurable properties that use the accessors
    Object.defineProperties(this, {
        password: {get: getPassword, set: setPassword, enumerable: true, configurable: false},
        email: {get: getEmail, set: setEmail, enumerable: true, configurable: false},
        fullName: {get: getFullName, set: setFullName, enumerable: true, configurable: false}
    });

    if (profile.password)
        setPassword(profile.password);
    setEmail(profile.email);
}

UserSchema.prototype.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
};

UserSchema.prototype.authenticate = function (password) {
    console.log('In user.server.model.js authenticate ' + this.hashPassword(password));
    return this.password === this.hashPassword(password);
};

UserSchema.prototype.save = function (callback) {
    // First hash the password if present (not if Oauth)
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }

    var prepStatement = {
        name: 'insert task',
        text: 'INSERT INTO users (firstname, lastname, username, salt, provider, providerid, providerdata, password, email, created) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now()) RETURNING id',
        values: [this.firstname, this.lastname, this.username, this.salt, this.provider, this.providerId, this.providerData, this.password, this.email]
    };

    var client = pg1();
    client.connect();
    var query =  client.query(prepStatement);

    query.on('error', function(error) {
        console.log('error running insert', error);
        callback(error);
    });

    query.on('row', function(row) {
        //do something w/ yer row data
        console.log('Returned a row');
    });

    query.on('end', function(result){
        console.log('Query ended');
        client.end();
        callback(null);
    });
};

UserSchema.findUniqueUsername = function (username, suffix, callback) {
    console.log('In user.server.model.js findUniqueUsername');

    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({username: possibleUsername}, function (err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

UserSchema.findOne = function (condition, fields, options, callback) {
    // Handle the optional parameters
    if ('function' == typeof options) {
        callback = options;
        options = null;
    } else if ('function' == typeof fields) {
        callback = fields;
        fields = null;
        options = null;
    } else if ('function' == typeof conditions) {
        callback = conditions;
        conditions = {};
        fields = null;
        options = null;
    }
    var whereClause = 'WHERE ';
    if(condition) {
        for (var c in condition) {
            whereClause += c + "='" + condition[c] + "' ";
        }
    }
    var selectClause;
    if (fields)
        selectClause = 'SELECT id, firstname, lastname, username, provider, providerid, email, created ';
    else
        selectClause = 'SELECT * '
    console.log(selectClause + ' FROM users ' + whereClause);

    var client = pg1();
    client.connect();
    var query =  client.query(selectClause + 'FROM users ' + whereClause);

    query.on('error', function(error) {
        console.log('error running select', error);
        callback(error);
    });

    query.on('row', function(row) {
        var user = new UserSchema(row);
        //do something w/ yer row data
        console.log('Returned a row');
        callback(null, user);
    });

    query.on('end', function(result){
        console.log('Query ended');
        client.end();
    });

    };

module.exports = UserSchema;