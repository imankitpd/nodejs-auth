var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let db = {
    // localhost: 'mongodb://localhost:27017/EventManagement',
    mlab: 'mongodb://ankit:ankit@ds159328.mlab.com:59328/event-management'
    // mlab: 'mongodb://<dbuser>:<dbpassword>@ds159328.mlab.com:59328/event-management'
}

mongoose.connect( db.localhost || db.mlab);

// mongoose.connect('mongodb://localhost:27017/EventApp');

module.exports = {mongoose};


