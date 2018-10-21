var express = require('express');
var app = express();
var fs = require('fs');
var https = require('http');

var httpsPort = 80;

const options = {
    key: fs.readFileSync('./key.pem', 'utf8'),  
    cert: fs.readFileSync('./server.crt', 'utf8') 
};

var secureServer = https.createServer(app).listen(httpsPort, () => {
    console.log(">> CentraliZr listening at port " + httpsPort);  
});  

var io = require('socket.io')(secureServer);
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/html/GuestLogin.html');
});

app.get('/index.html',(req,res)=>{
    var uName = req.param;
});

i = 0;

io.on('connection', (socket)=>{
    console.log('a user connected');
    var msg = null;
    io.emit('userCount', 'Number Of Users Online:  '+ ++i);

    socket.on('chat message', (msg)=>{
        console.log('received msg from '+msg.userName+':'+msg.msg);
        io.emit('chat message1',msg);
    });

    socket.on('getGuestNumber', (msg)=>{
        io.emit('guestNumberFromServer',msg+'0'+i);
    });

    socket.on('disconnect', ()=>{
        io.emit('userCount', 'Number Of Users Online:  '+ --i);
    });
});

app.get('/script/GuestLogin.js',(req,res)=>{
    res.sendFile(__dirname+'/public/script/GuestLogin.js');
});

app.get('/images/Untitled.png',(req,res)=>{
    res.sendFile(__dirname+'/public/images/Untitled.png');
});

app.get('/images/background.jpg',(req,res)=>{
    res.sendFile(__dirname+'/public/images/background.jpg');
});

app.get('/css/styles.css',(req,res)=>{
    res.sendFile(__dirname+'/public/css/styles.css');
});