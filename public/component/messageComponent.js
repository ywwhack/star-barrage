var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var MessageBox = React.createClass({
    getInitialState:function(){
        return {data:[], orderBy:'time'};
    },
    componentDidMount:function(){
        socket.on('login success', function(data){
            userInfo = data.user;
            userInfo.avator = '1.png';
            document.getElementById('login').style.display = 'none';
            document.getElementById('container').style.display = 'block';
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
            <div>
                <MessageSwitch onSwitchClick={this.switchClick} />
                <MessageList data={this.state.data} onStarClick={this.starClick}/>
                <MessageForm onMessageSubmit={this.messageSubmit}/>
            </div>
        );
    }
});

var MessageList =React.createClass({
    handleClick:function(id){
        this.props.onStarClick(id);
    },
    render:function(){
        var self = this;
        var lists = this.props.data.map(function(message){
            return (
                <li key={message._id} className="media">
                    <div className="media-left media-middle">
                        <img className="media-object" src={message.avator}/>
                    </div>
                    <div className="media-body">
                        <h4 className="media-heading">{message.name}</h4>
                        <p className="content">{message.content}</p>
                        <p>
                            <span
                                onClick={self.handleClick.bind(self, message._id)}
                                className={message.star.indexOf(userInfo.uid)>-1?'glyphicon glyphicon-heart red':'glyphicon glyphicon-heart-empty'}
                                onTouchEnd={self.handleClick.bind(self, message._id)}
                                >
                            </span>
                            <span>{message.star.length?'+'+message.star.length:''}</span>
                        </p>
                    </div>
                </li>
            );
        });
        return (
            <ReactCSSTransitionGroup component="ul" transitionName="example">
                {lists}
            </ReactCSSTransitionGroup>
        );
    }
});

var MessageForm = React.createClass({
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
            <div className="row message-box">
                <form className="form-horizontal" onSubmit={this.handleSubmit}>
                    <div className="form-group no-padding no-margin">
                        <div className="col-xs-9">
                            <input type="text" className="form-control" ref="message"/>
                        </div>
                        <div className="col-xs-3">
                            <input type="submit" className="btn btn-default btn-block" value="发送"/>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
});

var MessageSwitch = React.createClass({
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
            <div className="row">
                <ul className="col-xs-offset-3 col-xs-6 row switch" onClick={this.handleSwitch} ref="switch">
                    <li className="col-xs-6 active" data-order="time">按时间</li>
                    <li className="col-xs-6" data-order="star">按赞数</li>
                </ul>
            </div>
        );
    }
});

React.render(
    <MessageBox pollInterval={50}/>,
    document.getElementById('container')
);
