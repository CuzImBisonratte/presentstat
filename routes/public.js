const express = require('express');
const router = express.Router();

// Serve the ../frontend/public dir
router.use(express.static('frontend/public'));

module.exports = router;