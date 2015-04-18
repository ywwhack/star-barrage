var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    uid:Number,
    name:String,
    avator:String
});

var User = mongoose.model('User', userSchema);

module.exports = User;