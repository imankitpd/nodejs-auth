const express = require('express');
const fs = require('fs');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method}: ${req.url}`;

    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        console.log('unable to append in server.log');
    });
    next();
});

app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>');
});

app.listen(3000, () => {
    console.log('Listening at Port 3000');
});