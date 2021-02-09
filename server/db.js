'use strict';

const fs      = require('fs');
const prom    = require('util').promisify;
const sqlite3 = require('sqlite3').verbose();
const config  = require('server/config');
const helpers = require('server/helpers');

const dbFile = config.DATABASE;
const exists = (dbFile === ':memory:') ? true : fs.existsSync(dbFile);

if (!exists) {
    console.error('DB file not found');
    process.exit(1);
}

// Initialize sqlite db.
const db = new sqlite3.Database(dbFile);

const dbAll = prom(db.all.bind(db));

/**
 * Send an sql query to the sqlite database.
 *
 * @param query Query object.
 * @example
 * {
 *     sql: string,
 *     args: object,
 * }
 */
exports.query = function query(query) {
    const argsWithPrefix = helpers.prefixKeys(query.args, '$');

    return dbAll(query.sql, argsWithPrefix)
        .then(rows => rows)
        .catch(error => {
            console.error(
                'Failed query: \n\n' +
                query.sql +
                '\n\n' +
                'Arguments: \n\n' +
                JSON.stringify(argsWithPrefix) +
                '\n\n'
            );

            throw error;
        });
};
