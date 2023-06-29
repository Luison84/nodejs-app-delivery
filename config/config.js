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
    'host': process.env.PGHOST  || 'localhost',
    'port': process.env.PGPORT || '5432',
    'database': process.env.PGDATABASE || 'delivery_db',
    'user': process.env.PGUSER || 'postgres',
    'password': process.env.PGPASSWORD || 'Rafael0701'
}

const db = pgp(databaseConfig);

module.exports = db;