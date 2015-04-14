var EventEmitter = require('events'),
    fs = require('fs');

var winners = [],
    left = 2,
    emitter = new EventEmitter();

emitter.once('sold all', function(){
    fs.writeFile('winners.json', JSON.stringify(winners), function(){
        console.log('票被抢完了');
    });
});

module.exports = function(socket, fns, io){
    socket.on('add ticket_message', function(data){
        fns.checkIfAttact(socket);
        io.emit('ticket message', fns.dropHtml(data));
    });

    socket.on('grap ticket', function(data){
        fns.checkIfAttact(socket);
        if(!left){
            emitter.emit('sold all');
            socket.emit('no ticket');
        }else if(winners.indexOf(data)>-1){
            socket.emit('had ticket');
        }else{
            left--;
            winners.push(data);
            fs.appendFile('winners.txt', data+' ');
            socket.emit('get ticket');
        }
    });
};
