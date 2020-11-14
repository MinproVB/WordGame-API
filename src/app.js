const express = require('express');
const cookieParser = require('cookie-parser');
const cookies = require('cookies');
const routes = require('./router');
const app = express();

app.use('/', express.static(__dirname + '/public/'));

app.use(cookieParser());
app.use(cookies.express(['random key']));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use('/', routes);

module.exports = app;