var crypto = require('crypto'),
    Utils = require('./utils.js'),
    utils = new Utils();

var Client = function(socket) {
	// Constructor
	this.connections = [];

    this.ID = crypto.randomBytes(64).toString('hex');

    this.addConnection(socket);

    // Send MOTD
    socket.emit('message', {'message': 'Hello world'});
}

Client.prototype.addConnection = function(socket) {
    this.connections.push(socket);

    // Set up handlers for new connection
    this.addHandlers(socket);

    // Acknowledge client
    socket.emit('registered', this.ID);
}

Client.prototype.openConnections = function() {
    return this.connections.length;
}

Client.prototype.addHandlers = function(socket) {
    var self = this;

    socket.on('disconnect', function() {
        console.log('[%s] %s [%s]', utils.shortID(socket.id), 'Disconnecting'.white, utils.shortID(self.ID));

        // Find this connection in the list of open connections
        var connectionsLength = self.connections.length;
        for (i = 0; i < connectionsLength; i++) {
            if (self.connections[i].id == socket.id) {
                delete self.connections.splice(i, 1);

                console.log('[%s] %s [%s](%d)', utils.shortID(socket.id), 'Disconnected'.magenta, utils.shortID(self.ID), self.openConnections());

                break;
            }
        }

        self.checkChildlessness();
    });
}

Client.prototype.checkChildlessness = function() {
    var self = this;
    if (this.childlessnessTimeout) {
        clearTimeout(this.childlessnessTimeout);
    }

    this.childlessnessTimeout = setTimeout(function() {
        // Are there any open connections, remove client
        if (self.connections.length === 0) {
            global.removeClient(self.ID);
            console.log('%s [%s]', 'Removed childless client'.magenta, utils.shortID(self.ID));
        }
    }, 5000);
}

module.exports = Client;