const Mongoose = require('mongoose');

Mongoose.connect('mongodb://localhost:27017/Clearance');
Mongoose.Promise = global.Promise;

module.exports = {
    Mongoose
}