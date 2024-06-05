const router = require('express').Router();

router.get('/', (req, res) => {
    res.send('Hello from pub-view');
});

module.exports = router;