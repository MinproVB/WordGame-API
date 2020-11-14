const express = require('express');
const utils = require('../utils');
const wordgames = require('../../wordgame.json');
const DiscordController = require('../controllers/DiscordController');
const auth = require('../middleware/auth-web');
const router = express.Router();

router.use(auth());

router.get('/', (req,res) => {
    res.render('home', {
        user: req.user,
        random: utils.random(wordgames).wordgame,
        length: wordgames.length 
    });
});

router.get('/login', DiscordController.redirect());
router.get('/login/callback', DiscordController.callback());

router.get('/account', (req,res) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    res.render('account', {
        user: req.user
    })
})

router.get('/suggestion', (req,res) => {
    if(!req.user) {
        return res.redirect('/login');
    }
    res.render('suggestion', {
        user: req.user
    })
})

module.exports = router;