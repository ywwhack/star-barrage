var Message = require('../models/messages'),
    fs = require('fs');

module.exports = function(socket, fns, io){
    socket.on('login', function(username){
        fns.checkIfAttact(socket);
        fs.readFile('users.json', 'utf-8', function(err, data){
            if(err){
                socket.emit('login false');
            }else{
                var users = JSON.parse(data),
                    found = false;
                for(var i=0;i<users.length;i++){
                    if(users[i].name == username){
                        found = users[i];
                        break;
                    }
                }
                if(!found){
                    socket.emit('login false');
                }else{
                    Message.find({}).sort({mid:-1}).exec(function(err, messages){
                        if(err) console.log(err);
                        socket.emit('login success', {user:found, messages:messages});
                    });
                }
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
            fns.updateList(socket);
        });
    });

    //a switch is clicked
    socket.on('switch', function(){
        fns.checkIfAttact(socket);
        fns.updateList(socket);
    });
};
