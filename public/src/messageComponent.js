var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MessageBox = React.createClass({displayName: "MessageBox",
    getInitialState:function(){
        return {data:[], orderBy:'time'};
    },
    componentDidMount:function(){
        socket.on('login success', function(data){
            localStorage.setItem('uid', data.user.uid);
            userInfo = data.user;
            login();
            data.messages = this.howToDisplayData(this.state.orderBy, data.messages);
            this.setState({data:data.messages});
        }.bind(this));

        socket.on('updateList', function(data){
            data = this.howToDisplayData(this.state.orderBy, data);
            this.setState({data:data});
        }.bind(this));
    },
    messageSubmit:function(message){
        socket.emit('add message', message);
    },
    starClick:function(id){
        var messages = this.state.data;
        for(var i=0;i<messages.length;i++){
            if(messages[i]._id == id){
                var star = messages[i].star;
                if(star.indexOf(userInfo.uid) > -1) return;
                messages[i].star.push(userInfo.uid);
                socket.emit('star', {_id:id, star:messages[i].star});
                break;
            }
        }
        this.setState({data:this.state.data});
    },
    howToDisplayData:function(order, data){
        if(order == 'star'){
            data = data.sort(function(item1, item2){
                return item2.star.length - item1.star.length;
            });
        }
        return data;
    },
    switchClick:function(order){
        this.setState({orderBy:order});
        socket.emit('switch');
    },
    render:function(){
        return (
            React.createElement("div", null, 
                React.createElement(MessageSwitch, {onSwitchClick: this.switchClick}), 
                React.createElement(MessageList, {data: this.state.data, onStarClick: this.starClick}), 
                React.createElement(MessageForm, {onMessageSubmit: this.messageSubmit})
            )
        );
    }
});

var MessageList =React.createClass({displayName: "MessageList",
    handleClick:function(id){
        this.props.onStarClick(id);
    },
    render:function(){
        var self = this;
        var lists = this.props.data.map(function(message){
            return (
                React.createElement("li", {key: message._id, className: "media"}, 
                    React.createElement("div", {className: "media-left media-middle"}, 
                        React.createElement("img", {className: "media-object", src: message.avator})
                    ), 
                    React.createElement("div", {className: "media-body"}, 
                        React.createElement("h4", {className: "media-heading"}, message.name), 
                        React.createElement("p", {className: "content"}, message.content), 
                        React.createElement("p", null, 
                            React.createElement("span", {
                                onClick: self.handleClick.bind(self, message._id), 
                                className: message.star.indexOf(userInfo.uid)>-1?'glyphicon glyphicon-heart red':'glyphicon glyphicon-heart-empty', 
                                onTouchEnd: self.handleClick.bind(self, message._id)
                                }
                            ), 
                            React.createElement("span", null, message.star.length?'+'+message.star.length:'')
                        )
                    )
                )
            );
        });
        return (
            React.createElement(ReactCSSTransitionGroup, {component: "ul", transitionName: "example"}, 
                lists
            )
        );
    }
});

var MessageForm = React.createClass({displayName: "MessageForm",
    handleSubmit:function(ev){
        ev.preventDefault();
        var content = this.refs.message.getDOMNode().value,
            message;
        if(!content) return;
        message = {
            mid:Date.now(),
            name:userInfo.name,
            avator:userInfo.avator,
            content:content,
            star:[]
        };
        this.props.onMessageSubmit(message);

        this.refs.message.getDOMNode().value = '';
    },
    render:function(){
        return (
            React.createElement("div", {className: "row message-box"}, 
                React.createElement("form", {className: "form-horizontal", onSubmit: this.handleSubmit}, 
                    React.createElement("div", {className: "form-group no-padding no-margin"}, 
                        React.createElement("div", {className: "col-xs-9"}, 
                            React.createElement("input", {type: "text", className: "form-control", ref: "message"})
                        ), 
                        React.createElement("div", {className: "col-xs-3"}, 
                            React.createElement("input", {type: "submit", className: "btn btn-info btn-block", value: "发送"})
                        )
                    )
                )
            )
        );
    }
});

var MessageSwitch = React.createClass({displayName: "MessageSwitch",
    handleSwitch:function(ev){
        var aLi = this.refs.switch.getDOMNode().children,
            target = ev.target,
            order = target.dataset.order;
        if(target.nodeName == 'UL') return;
        for(var i=0;i<aLi.length;i++){
            aLi[i].className = 'col-xs-6';
        }
        target.className = 'col-xs-6 active';
        this.props.onSwitchClick(order);
    },
    render:function(){
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("ul", {className: "col-xs-offset-3 col-xs-6 row switch", onClick: this.handleSwitch, ref: "switch"}, 
                    React.createElement("li", {className: "col-xs-6 active", "data-order": "time"}, "按时间"), 
                    React.createElement("li", {className: "col-xs-6", "data-order": "star"}, "按赞数")
                )
            )
        );
    }
});

React.render(
    React.createElement(MessageBox, {pollInterval: 50}),
    document.getElementById('container')
);
