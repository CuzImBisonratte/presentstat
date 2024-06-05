const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello from live view');
});

module.exports = router;