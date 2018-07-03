const io = require('socket.io-client');

export default function () {
    const socket = io();

    const id = () => {
        return socket.id;
    };

    function registerGameStartHandler(onGameStart) {
        socket.on('gameStart', onGameStart)
    }

    function registerTurnOutcomeHandler(onTurnOutcome) {
        socket.on('turnOutcome', onTurnOutcome)
    }

    function registerGameEndHandler(onGameEnd) {
        socket.on('gameEnd', onGameEnd)
    }

    // function unregisterHandler() {
    //     socket.off('turnOutcome')
    // }

    socket.on('error', function (err) {
        console.log('received socket error:');
        console.log(err)
    });

    function findGame(name, level, cb) {
        socket.emit('findGame', name, level, cb)
    }

    function selectLine(gameId, line, cb) {
        socket.emit('selectLine', { gameId, line }, cb)
    }

    return {
        id,
        registerGameStartHandler,
        registerTurnOutcomeHandler,
        registerGameEndHandler,
        findGame,
        selectLine,
    }
}