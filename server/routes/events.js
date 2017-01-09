const express = require('express');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

const router = express.Router();

const {mongoose} = require('../db/mongoose');
const {Event} = require('../models/event');
var {authenticate} = require('../middleware/authenticate');

router.post('/', authenticate, (req, res) => {
    var event = new Event({
        text: req.body.text,
        _creator: req.user._id
    });

    event.save().then((doc) => {
        res.json({
            success: true
        });
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/',authenticate ,(req, res) => {
    Event.find({
        _creator: req.user._id
    }).then((events) => {
        res.send({events});
    }, (e) => {
        res.status(400).send(e);
    });
});

router.get('/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Event.findById(id).then((event) => {
        if (!event) {
            return res.status(404).send(event);
        }

        res.send({event});
        }).catch((e) => {
        res.status(400).send();
    });
});

router.delete('/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Event.findByIdAndRemove(id).then((event) => {
        if (!id) {
            return res.status(404).send();
        }

        res.json({
            success: true
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

router.patch('/:id', authenticate, (req, res) => {
    var id = req. params.id;
    var body = _.pick(req.body, ['text','completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Event.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((event) => {
        if(!event) {
            return res.status(404).send();
        }

        res.send({event});
    }).catch((e) => {
        res.status(400).send();
    });
});



module.exports = router;