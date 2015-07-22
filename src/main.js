var http = require('http'),
	server = http.createServer(),
	io = require('socket.io')(server),
    fs = require('fs'),
    colors = require('colors'),

    Utils = require('./lib/utils.js'),
    utils = new Utils(),
    Client = require('./lib/client.js'),

    port = 3000,
    clients = [];

server.listen(port, function () {
    console.log('Server listening at port %d\n', port);
});


io.on('connection', connect);

function connect(socket) {
    console.log('[%s] %s', utils.shortID(socket.id), 'New connection'.white);

    socket.on('register', function(clientID) {
        if (clientID) {
            // Does this client still exist?
            if (clientID in clients) {
                var client = clients[clientID];
                client.addConnection(socket);

                console.log('[%s] %s - Existing [%s](%d)', utils.shortID(socket.id), 'Registered'.green, utils.shortID(client.ID), client.openConnections());
            }
        }

        if (!client) {
            var client = new Client(socket);

            console.log('[%s] %s - New [%s](%d)', utils.shortID(socket.id), 'Registered'.green, utils.shortID(client.ID), client.openConnections());

            // Store client
            clients[client.ID] = client;
        }
    });
}

global.removeClient = function(ID) {
    delete clients[ID];
}