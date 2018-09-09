var express = require('express');
var app = express();
var fs = require('fs');
var https = require('https');

var httpsPort = 3001;

const options = {
    key: fs.readFileSync('./key.pem', 'utf8'),  
    cert: fs.readFileSync('./server.crt', 'utf8') 
};

var secureServer = https.createServer(options, app).listen(httpsPort, () => {  
    console.log(">> CentraliZr listening at port " + httpsPort);  
});  

var io = require('socket.io')(secureServer);
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/index.html');
});

io.on('connection', (socket)=>{
    console.log('a user connected');
    socket.on('chat message', (msg)=>{
        console.log('received msg from client: '+msg);
        var msg = msg.replace(/<[^>]+>/g, '');
        io.emit('chat message1',msg);
    });
});

app.get('/css/styles.css',(req,res)=>{
    res.sendFile(__dirname+'/css/styles.css');
});