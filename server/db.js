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
exports.sendQuery = function sendQuery(query) {
    const parametersWithPrefix = helpers.prefixKeys(query.parameters, '$');

    return dbAll(query.sql, parametersWithPrefix)
        .then(rows => rows)
        .catch(error => {
            console.error(
                'Failed query: \n\n' +
                query.sql +
                '\n\n' +
                'Parameters: \n\n' +
                JSON.stringify(parametersWithPrefix) +
                '\n\n'
            );

            throw error;
        });
};
