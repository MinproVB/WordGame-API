const express = require('express');
const utils = require('../utils');
const wordgames = require('../../wordgame.json');
const auth = require('../middleware/auth-api');
const router = express.Router();

router.use(auth());

router.get('/random', (req,res) => {
    res.status(200).json(utils.random(wordgames));
})

router.get('/:id', (req,res) => {
    const wordgame = wordgames.find(wordgame => wordgame.id == req.params.id);

    if(wordgame) {
        res.status(200).json(wordgame)
    } else {
        res.status(404).json({status: 404, message: "Wordgame's ID not found"});
    }
})

module.exports = router;