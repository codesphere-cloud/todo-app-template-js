'use strict';

const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const config     = require('server/config');
const queries    = require('server/queries');

const app = module.exports = express();

// It's best to use Helmet early in your middleware stack so that its headers are sure to be set.
app.use(helmet());

// Body parsing middleware.
app.use(bodyParser.json());

// Pretty JSON output.
app.set('json spaces', 4);

// Serve static client files.
app.use('/', express.static(path.join(__dirname, '../client')));

(async bootstrap() => {

    // Create database tables.
    await db.sendQuery({sql: queries.createBudgetRequestsTable});

    // Start the server.
    app.listen(config.API_PORT, () => {
        console.info(`Todo app started at: ${config.API_PORT}`);
    });

})().catch(error => console.error(error.stack));
