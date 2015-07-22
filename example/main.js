$(function() {
    
    var socket = io('http://localhost:3000');

    // Have we connected before?
    var ncClientID = localStorage.getItem('ncClientID');

    socket.on('connect', function() {
        socket.emit('register', ncClientID);
    });

    socket.on('registered', function(ID) {
        localStorage.setItem('ncClientID', ID);
    });

    socket.on('message', function(data) {
        console.log(data);
        $('body').append(JSON.stringify(data) + '<br/>');
    });

});