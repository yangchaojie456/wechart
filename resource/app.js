var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.send('<h1>Welcome Realtime Server</h1>');
});


//在线用户  
var onlineUsers = {};
//当前在线人数  
var onlineCount = 0;

io.on('connection', function(socket) {
    console.log('a user connected');

    // 监听新用户加入
    socket.on('login', function(name) {
            // socket.id 作为用户id
            // console.log(name,socket.id)
            
            onlineUsers[socket.id] = name;
                
            
            onlineCount = Object.keys(onlineUsers).length;
            
            //向所有客户端广播用户加入  
            io.emit('hasLogin', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: socket.id });
            console.log(name + '加入了聊天室');
        })

    // 监听用户退出
    // socket.on('disconnect', (reason) => {
    //     reason （字符串）断开的原因（客户端或服务器端）
    //   });
    socket.on('disconnect', function(reason) {
        console.log(reason)
            //将退出的用户从在线列表中删除  
            
                //退出用户的信息  
                var name = onlineUsers[socket.id]
                //删除  
                delete onlineUsers[socket.id];
                //在线人数
                onlineCount = Object.keys(onlineUsers).length;
                //向所有客户端广播用户退出
                io.emit('logout', { onlineUsers: onlineUsers, onlineCount: onlineCount, user: name });
                if(name){
                    console.log(name + '退出了聊天室');
                }
            
        })
        //监听用户发布聊天内容  
    socket.on('message', function(message) {
        //向所有客户端广播发布的消息  
        // socket.broadcast.emit
        io.emit('message', { name: onlineUsers[socket.id], message: message });
        console.log(onlineUsers[socket.id], message);
    });
})



http.listen(3000, function() {
    console.log('listening on localhost:3000');
});