'use strict';

const path       = require('path');
const express    = require('express');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const config     = require('server/config');
const db         = require('server/db');
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

app.post('/tasks', async (req, res) => {
    const args = req.body;

    return db.query({sql: queries.createTask, args})
        .then(() => db.query({sql: queries.getLastTask}))
        .then(rows => res.status(201).json(rows[0]));
});

app.get('/tasks', async (req, res) => {
    return db.query({sql: queries.listTasks})
        .then(rows => res.status(200).json(rows));
});

app.post('/tasks/:id', async (req, res) => {
    const {id} = req.params;
    const {checked} = req.body;

    return db.query({sql: queries.toggleTask, args: {id, checked}})
        .then(() => res.sendStatus(200));
});

app.delete('/tasks/:id', async (req, res) => {
    const {id} = req.params;

    return db.query({sql: queries.deleteTask, args: {id}})
        .then(() => res.sendStatus(200));
});

(async () => {

    // Create database tables.
    await db.query({sql: queries.createTasksTable});

    // Start the server.
    app.listen(config.API_PORT, () => {
        const appUrl = process.env.WORKSPACE_DEV_DOMAIN
            ? `https://${process.env.WORKSPACE_DEV_DOMAIN}/`
            : `http://localhost:${config.API_PORT}/`;
        
        console.info(`Ready! Follow the link to open your app: ${appUrl}`);
    });

})().catch(error => console.error(error.stack));
