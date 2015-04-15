var userInfo = {},
    socket = io('http://localhost:3000');

React.initializeTouchEvents(true);

window.onload = function(){
    var oLogin = document.getElementById('login');

    socket.on('disconnect', function(data){
        if(data == 'io server disconnect'){
            alert('请不要发起攻击！');
        }
        location.reload();
    });

    oLogin.onsubmit = function(ev){
        ev.preventDefault();
        socket.emit('login', oLogin.name.value);

        socket.on('login false', function(){
            alert('用户不存在');
        });
    };
};