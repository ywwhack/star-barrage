var userInfo = {},
    socket = io('http://localhost:3000');

React.initializeTouchEvents(true);

window.onload = function(){
    var oLogin = document.getElementById('login'),
        uid = localStorage.getItem('uid');
    if(uid){
        socket.emit('no-login', uid);
    }

    socket.on('disconnect', function(data){
        if(data == 'io server disconnect'){
            alert('~~~~');
        }
        location.reload();
    });

    socket.on('reload', function(){
        localStorage.clear();
    });

    oLogin.onsubmit = function(ev){
        ev.preventDefault();
        var randomAvator = Math.round(1+Math.random()*7);
        socket.emit('login', {
            uid:Date.now(),
            name:oLogin.name.value,
            avator:'avator/'+randomAvator+'.png'
        });

        socket.on('login false', function(){
            alert('昵称已经被用了哦～');
        });
    };
};

function login(){
    document.getElementById('login').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    document.querySelector('.container-fluid').style.padding = '0px';
}