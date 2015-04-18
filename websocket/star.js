var Message = require('../models/messages'),
    User = require('../models/users');
    fs = require('fs');

module.exports = function(socket, fns, io){
    socket.on('login', function(userinfo){
        fns.checkIfAttact(socket);
        var user = new User(userinfo);
        User.findOne({name:userinfo.name}, function(err, u){
            if(!u){
                user.save(function(err, user){
                    if(err){
                        console.log(err);
                    }else{
                        Message.find({}).sort({mid:-1}).exec(function(err, messages){
                            socket.emit('login success', {messages:messages, user:user});
                        });
                    }
                });
            }else{
                socket.emit('login false');
            }
        });
    });

    //a user submit a message
    socket.on('add message', function(data){
        fns.checkIfAttact(socket);
        if(typeof(data) != 'object'){
            return;
        }
        var message = new Message(data);
        message.save(function(err, message){
            if(err) console.log(err);
            fns.updateList(socket, io);
            io.emit('barrage message', data.content);
        });
    });

    //a star is clicked
    socket.on('star', function(message){
        fns.checkIfAttact(socket);
        Message.findByIdAndUpdate(message._id, {star:message.star}, function(err, message){
            if(err) console.log(err);
            fns.updateList(socket, io);
        });
    });

    //a switch is clicked
    socket.on('switch', function(){
        fns.checkIfAttact(socket);
        fns.updateList(socket);
    });

    //reload
    socket.on('no-login', function(data){
        User.findOne({uid:data}).exec(function(err, user){
            if(user){
                Message.find({}).sort({mid:-1}).exec(function(err, messages){
                    socket.emit('login success', {messages:messages, user:user});
                });
            }else{
                socket.emit('reload');
            }
        });
    });
};
