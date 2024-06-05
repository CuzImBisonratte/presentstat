const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello from controller');
});

module.exports = router;