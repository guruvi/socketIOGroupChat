$( document ).ready(function() {
    $('#enteredUserDetails').hide();
    $('#userDetailsEnter').show();
});

function toggleDisplay(){
    if($('#userDetailsEnter').attr('style')=='display: none;'){
        $('#userDetailsEnter').show();
        $('#enteredUserDetails').hide();
    }else if($('#enteredUserDetails').attr('style')=='display: none;'){
        $('#userDetailsEnter').show();
        $('#enteredUserDetails').hide();
    }
}

function GoButtonClick() {
    var userName = $('#userName').val();
    $('#enteredUserDetails').show();
    $('#userDetailsEnter').hide();
    if(userName){
        $('#enteredUserName').html('');
        $('#enteredUserName').html($('#userName').val());
    }else{
        socket.emit('getGuestNumber','guest');
    }    
}

var socket = io();

function runScript(e){
    if (e.keyCode == 13) {
        send();
    }
}

var rxMsgCount = 0;

function send(){
    if($('#chatMsg').val()){
        var guestUserName = '';
        var msgObject = '';
        var msgToSend = $('#chatMsg').val();
        if($('#userName').val()){
            guestUserName = $('#userName').val();
            msgObject = {
                userName: guestUserName,
                msg:msgToSend 
            };
            socket.emit('chat message', msgObject);
            $('#chatMsg').val('');
        }else{
            socket.emit('getGuestNumber','guest');
        }
    }
}
socket.on("chat message1", function(dataFromServer){
    ++rxMsgCount;
    var msg = dataFromServer ;
    var sentMsg = '';
    if(dataFromServer.userName == $('#userName').val()){
        sentMsg = '<div id=rxMsgCount'+rxMsgCount+' class = "align-right"><div class="name-left"><strong>';
    }else{
        sentMsg = '<div id=rxMsgCount'+rxMsgCount+' class = "align-left"><div class="name-right"><strong>';
    }
    sentMsg = sentMsg + dataFromServer.userName + '</strong></div>';
    sentMsg = sentMsg + '<div class="chatText">'+dataFromServer.msg;
    sentMsg = sentMsg + '</div></div>';
    $($.parseHTML(sentMsg)).appendTo($('#chatArea'));
    
    $('#chatArea').scrollTop($('#chatArea').scrollTop()+1000);
});

socket.on('guestNumberFromServer',function(dataFromServer){
    var msgToSend = $('#chatMsg').val();
    if(!$('#userName').val()){
        $('#userName').val(dataFromServer);
        GoButtonClick();
        if(msgToSend){
            var guestUserName = dataFromServer;
            msgObject = {
                userName: guestUserName,
                msg: msgToSend
            };
            socket.emit('chat message', msgObject);
            $('#chatMsg').val('');
        }
    }
});

socket.on('userCount',function(dataFromServer){
    $('#numberOfActiverUsers').html(dataFromServer);
});