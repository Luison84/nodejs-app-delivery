const promise = require('bluebird');

const options = {
    promiseLib: promise,
    query: (e) => {}
}

const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, (stringValue) => {
    return stringValue;
});

const databaseConfig = {
    'host': process.env.DB_HOST  || 'localhost',
    'port': process.env.DB_PORT || '5432',
    'database': process.env.DB_DATABASE || 'delivery_db',
    'user': process.env.DB_USER || 'postgres',
    'password': process.env.DB_PASSWORD || 'Rafael0701'
}

const db = pgp(databaseConfig);

module.exports = db;