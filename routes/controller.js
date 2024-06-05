const express = require('express');
const router = express.Router();

// Serve the ../frontend/controller dir
router.use(express.static('frontend/controller'));

module.exports = router;