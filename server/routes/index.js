const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Event Management',
        index: true
    });
});

router.get('/about-us', (req, res) => {
    res.render('about-us', {
        title: 'Event Management',
        about_us: true
    });
});

router.get('/contact-us', (req, res) => {
    res.render('contact-us', {
        title: 'Event Management',
        contact_us: true
    });
});

module.exports = router;