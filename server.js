var express = require('express'),
    mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server);

require('./app')(app); //express app
require('./websocket')(io); //websocket

server.listen(3000, function(){
    console.log('listening on port 3000');
});