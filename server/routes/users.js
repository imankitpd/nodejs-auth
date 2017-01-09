const express = require('express');
const _ = require('lodash');
const router = express.Router();

const {mongoose} = require('../db/mongoose');
const {User} = require('../models/user');
var {authenticate} = require('../middleware/authenticate');

router.post('/', (req, res) => {
    var body = _.pick(req.body, ['first_name','last_name','email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        res.status(200).json({
            success: true
        });
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.get('/me', authenticate, (req, res) => {
    res.send(req.user);
});

router.post('/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user)=> {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).json({
                success: true
            });
        });        
    }).catch((e) => {
        res.status(400).send(e);
    });
});

router.delete('/me/token',authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});


module.exports = router;