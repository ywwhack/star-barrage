var Message = require('../models/messages'),
    User = require('../models/users'),
    fs = require('fs'),
    co = require('co');

function loginSuccess(socket, user){
    co(function* (){
        var messages = yield Message.find({}).sort({mid:-1}).exec();
        socket.emit('login success', {messages:messages, user:user});
    });
}

module.exports = function(socket, fns, io){
    socket.on('login', function(userinfo){
        fns.checkIfAttact(socket);
        var user = new User(userinfo);
        co(function* (){
            var user = yield User.create(userinfo);
            loginSuccess(socket, user);
        }).catch(function(e){
            socket.emit('login false');
            console.log(e);
        });
    });

    //a user submit a message
    socket.on('add message', function(data){
        fns.checkIfAttact(socket);
        if(typeof(data) != 'object'){
            return;
        }
        co(function* (){
            try{
                yield Message.create(data);
                fns.updateList(socket, io);
                io.emit('barrage message', data.content);
            }catch(err){
                console.log(err);
            }
        });
    });

    //a star is clicked
    socket.on('star', function(message){
        fns.checkIfAttact(socket);
        co(function* (){
            yield Message.findByIdAndUpdate(message._id, {star:message.star}).exec();
            fns.updateList(socket, io);
        }).catch(function(e){
            console.log(e);
        });
    });

    //a switch is clicked
    socket.on('switch', function(){
        fns.checkIfAttact(socket);
        fns.updateList(socket);
    });

    //reload
    socket.on('no-login', function(data){
        co(function* (){
            var user = yield User.findOne({uid:data}).exec();
            if(user){
                loginSuccess(socket, user);
            }else{
                socket.emit('reload');
            }
        });
    });

    //clear messages
    socket.on('clear messages', function(){
        co(function* (){
            yield Message.remove({}).exec();
            fns.updateList(socket, io);
        }).catch(function(e){
            console.log(e);
        });
    });
};
