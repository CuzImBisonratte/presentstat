const express = require('express');
const app = express();

const controller = require('./routes/controller');
app.use('/ctrl', controller);

const live_view = require('./routes/live_view');
app.use('/live', live_view);

const public = require('./routes/public');
app.use('/public', public);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});