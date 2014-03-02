require('newrelic');

var http = require('http'),
    io = require('socket.io'),
    express = require('express'),
    crypto = require('crypto');

var app = express();
app.use(express.static(__dirname + '/static'));

var server = http.createServer(app);
var port = process.env.PORT || 8000;
server.listen(port);

var socket = io.listen(server);

var clients = [];

socket.sockets.on('connection', function(client) {
    clients.push(client);
    client.on('im', function(im) {
        crypto.randomBytes(8, function(ex, buf) {
            im.id = buf.toString('hex');
            clients.forEach(function(client) {
                client.emit('im', im);
            });
        });
    });
});
