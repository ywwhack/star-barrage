var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    uid:Number,
    name:{type:String, unique: true, dropDups: true},
    avator:String
});

var User = mongoose.model('User', userSchema);

module.exports = User;