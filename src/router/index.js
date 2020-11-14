const express = require('express');
const log = require('log-to-file');
const router = express.Router();

router.use((req,res,next) => {
    log(req.connection.remoteAddress, 'log.log');
    next();
})

router.use('/', require('./website'));
router.use('/api', require('./api'));

module.exports = router;