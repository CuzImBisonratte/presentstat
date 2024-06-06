// Modules
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Config
const config = require('./config');

// The controller routes (Served for the person who is controlling - mostly the host)
const controller = require('./routes/controller');
app.use('/ctrl', controller);

// Live view routes (Live stream of the results)
const live_view = require('./routes/live_view');
app.use('/live', live_view);

// Public routes (Served for all guests in the audience)
const public = require('./routes/public');
app.use('/', public);

// Websocket connection client (Served for all types of clients)
let ws_client = fs.readFileSync(path.join(__dirname, 'frontend', 'ws_client.js'), 'utf8').replace('{HOST}', config.WS_HOST).replace('{WS_PORT}', config.WS_PORT_EXTERNAL);
if (config.WS_USE_SSL) ws_client = ws_client.replace('ws://', 'wss://');
app.use('/ws', (req, res) => res.set('Content-Type', 'application/javascript').send(ws_client));

// Websocket server
require('./ws_server');

// Start the server
app.listen(config.PORT, () => {
    console.log('Server is running on port', config.PORT);
});