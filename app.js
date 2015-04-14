var express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    Message = require('./models/messages');

module.exports = function(app){
    app.use(express.static(__dirname+'/public', {index:false}));
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(bodyParser.json());

    app.post('/login', function(req, res){
        fs.readFile('users.json', 'utf-8', function(err, data){
            if(err){
                res.end(JSON.stringify(err));
            }else{
                var users = JSON.parse(data),
                    found = false;
                for(var i=0;i<users.length;i++){
                    if(users[i].name == req.body.name){
                        found = true;
                        res.end(JSON.stringify({status:1, userInfo:users[i]}));
                        return;
                    }
                }
                if(!found){
                    res.end(JSON.stringify({status:0}));
                }
            }
        });
    });

    app.get('/messages', function(req, res){
        Message.find({}).sort({mid:-1}).exec(function(err, messages){
            if(err) console.log(err);
            res.send(messages);
        });
    });

    app.post('/messages', function(req, res){
        var message = new Message(req.body.message);
        message.save(function(err, message){
            if(err) res.send(err);
            res.end();
        });
    });

    app.post('/star', function(req, res){
        var message = req.body;
        Message.findByIdAndUpdate(message._id, {star:message.star}, function(err, message){
            if(err) res.send(err);
            res.end();
        })
    });
};
