require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cookies = require('cookies');
const routes = require('./src/router');
const app = express();

app.use('/', express.static(__dirname + '/src/public/'));

app.use(cookieParser());
app.use(cookies.express(['random key']));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use('/', routes);

app.listen(80, () => console.log('WordGame API lancé'));