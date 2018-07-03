const Directions = {
    HORIZONTAL: "H",
    VERTICAL: "V",
};

module.exports = function(id, level, firstPlayer, secondPlayer) {

    const initLines = (rows, cols) => {
        const lines = {};
        lines[Directions.HORIZONTAL] = prepareHorizontalLines(rows, cols);
        lines[Directions.VERTICAL] = prepareVerticalLines(rows, cols);

        return lines;
    };

    const prepareHorizontalLines = (rows, cols) => Array(rows).fill(0).map(() => Array(cols + 1).fill(false));

    const prepareVerticalLines = (rows, cols) => Array(rows + 1).fill(0).map(() => Array(cols).fill(false));

    const initBoxes = (rows, cols) =>  Array(rows).fill(0).map(() => Array(cols).fill({closed: false}));


    let turnId = 0;
    let playerOnTurn;
    let gameFinished = false;
    const boxes = initBoxes(level.rows, level.cols);
    const selectedLines = initLines(level.rows, level.cols);


    const start = () => {
        playerOnTurn = randomPlayer();
        const score = gameScore();
        broadcastGameStart(id, turnId, level, score, playerOnTurn.socket.id, true);
    };

    const randomPlayer = () => flipCoin() ?  firstPlayer : secondPlayer;

    const flipCoin = () => Math.random() >= 0.5;

    const selectLine = (client, line) => {
        //TODO: Handle Game logic and send outcome
        broadcastTurnOutcome({});
    };


    const broadcastTurnOutcome = (outcome) => broadcastEvent('turnOutcome', outcome);

    const broadcastGameStart = (gameId, turnId, level, score, playerIdOnTurn, gameStarted) => {
        broadcastEvent('gameStart', {gameId, turnId, level, score, playerIdOnTurn, gameStarted});
    };

    const broadcastEvent = (event, outcome) => {
        firstPlayer.socket.emit(event, outcome);
        secondPlayer.socket.emit(event, outcome);
    };

    const removePlayer = (client) => {
        gameFinished = true;
        if(client.id === firstPlayer.socket.id) {
            secondPlayer.socket.emit('gameEnd', {message: "Your opponent has left the game!", gameFinished})
        } else {
            firstPlayer.socket.emit('gameEnd', {message: "Your opponent has left the game!", gameFinished})
        }
    };

    return {
        start,
        selectLine,
        removePlayer,
    };

};