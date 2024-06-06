const express = require('express');
const router = express.Router();

// Serve the previw page (without title bar - not for live view - part of controller)
router.use('/preview',
    express.static('frontend/live_view/preview')
);

// Serve the ../frontend/live_view dir
router.use(express.static('frontend/live_view'));

module.exports = router;