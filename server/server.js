// require(./config/config);
// const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');
const path = require('path');
const hbs = require('express-handlebars');
const port = process.env.PORT || 3000;

var users = require('./routes/users');
var events = require('./routes/events');
var index = require('./routes/index');

var app = express();
const publicPath = path.join(__dirname, '../public');

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, '/views'));

app.set('view engine', 'hbs');
app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use('/', index);
app.use('/users', users);
app.use('/events', events);

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = {app};