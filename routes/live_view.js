const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello from live view');
});

// Serve the ../frontend/live_view dir
router.use(express.static('frontend/live_view'));

module.exports = router;