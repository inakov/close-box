const http = require("http");
const path = require('path');
const express = require("express");
const socketIo = require("socket.io");
const GameManager = require('./GameManager');
const makeHandlers = require('./handlers');

const gameManager = GameManager();

const port = process.env.PORT || 9000;
const app = express();

app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", client => {

    const {
        handleFindGame,
        handleSelectLine,
        handleDisconnect
    } = makeHandlers(client, gameManager);

    client.on('findGame', handleFindGame);

    client.on('selectLine', handleSelectLine);

    client.on('disconnect', function () {
        console.log('client disconnect...', client.id);
        handleDisconnect()
    });

    client.on('error', function (err) {
        console.log('received error from client:', client.id);
        console.log(err)
    });

});

server.listen(port, () => console.log(`Listening on port ${port}`));
