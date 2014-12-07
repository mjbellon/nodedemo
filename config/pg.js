/**
 * Created by Mike on 11/2/2014.
 */
var config = require('./config'),
    pg = require('pg');

module.exports = function() {
    var db = new pg.Client(config.db);

    require('../app/models/user.server.model');

    return db;
};
