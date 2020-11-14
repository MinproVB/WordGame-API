const express = require('express');
const fs = require('fs');
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

router.post('/suggestion', (req,res) => {
    fs.readFile(__dirname + '/../../wordgame-notvalid.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        obj.push({author: req.headers.author, wordgame: req.headers.wordgame}); //add some data
        json = JSON.stringify(obj); //convert it back to json
        fs.writeFile(__dirname + '/../../wordgame-notvalid.json', json, 'utf8', () => {
            res.status(200).json({status: 200, message: 'Sucess'});
        }); // write it back 
    }});
})

module.exports = router;