var Message = require('./models/messages'),
    star = require('./websocket/star'),
    ticket = require('./websocket/ticket');

function dropHtml(string){
    var re = /<[^>]+>(.*)<\/[^>]+>/g,
        match = re.exec(string);
    if(match){
        return match[1];
    }else{
        return string;
    }
}

function updateList(socket, broadcast){
    Message.find({}).sort({mid:-1}).exec(function(err, messages){
        if(err) console.log(err);
        if(broadcast){
            socket.broadcast.emit('updateList', messages);
        }else{
            socket.emit('updateList', messages);
        }
    });
}

function checkIfAttact(socket){
    if(Date.now() - socket.lastTime < 500){
        socket.disconnect();
        console.log(socket.conn.remoteAddress);
        return true;
    }else{
        socket.lastTime = Date.now();
    }
}

module.exports = function(io){
    var fns = {
        updateList:updateList,
        checkIfAttact:checkIfAttact,
        dropHtml:dropHtml
    };

    io.on('connection', function(socket){
        socket.lastTime = Date.now();

        star(socket, fns, io);
        ticket(socket, fns, io);
    });
};
