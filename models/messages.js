var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageSchema = new Schema({
    mid:Number,
    name:String,
    avator:String,
    content:String,
    star:[Number]
},{versionKey:false});

var Message = mongoose.model('Message', messageSchema);

module.exports = Message;