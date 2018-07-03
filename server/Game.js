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
        turnId = turnId + 1;
        selectedLines[line.direction][line.row][line.col] = true;
        const closedBoxes = findClosedBoxes(line);
        closedBoxes.forEach(closedBox => {
            boxes[closedBox.row][closedBox.col] = closedBox;
            playerOnTurn.score = playerOnTurn.score + 1;
        });

        if(playerOnTurn.score > (level.rows * level.cols) / 2) {
            gameEnd();
        } else {
            if(closedBoxes.length < 1){
                if(playerOnTurn.socket.id === firstPlayer.socket.id) {
                    playerOnTurn = secondPlayer;
                } else {
                    playerOnTurn = firstPlayer;
                }
            }
            const score  = gameScore();
            broadcastTurnOutcome({
                turnId,
                selectedLine: line,
                closedBoxes,
                playerIdOnTurn: playerOnTurn.socket.id,
                gameFinished,
                score,
            });
        }
    };

    const findClosedBoxes = ({row, col, direction}) => {
        const closedBoxes = [];
        if (direction === Directions.VERTICAL) {
            if(row - 1 >= 0 && selectedLines[Directions.VERTICAL][row - 1][col]
                && selectedLines[Directions.HORIZONTAL][row - 1][col]
                && col + 1 < selectedLines[Directions.HORIZONTAL][row - 1].length && selectedLines[Directions.HORIZONTAL][row - 1][col + 1]) {
                closedBoxes.push({closed: true, col: row - 1, row: col, acronym: playerOnTurn.acronym});
            }
            if(row + 1 < selectedLines[Directions.VERTICAL].length && selectedLines[Directions.VERTICAL][row + 1][col]
                && selectedLines[Directions.HORIZONTAL][row][col]
                && col + 1 < selectedLines[Directions.HORIZONTAL][row].length && selectedLines[Directions.HORIZONTAL][row][col + 1]) {
                closedBoxes.push({closed: true, row: col, col: row, acronym: playerOnTurn.acronym});
            }
        } else if(direction === Directions.HORIZONTAL) {
            if(col - 1 >= 0 && selectedLines[Directions.HORIZONTAL][row][col - 1]
                && selectedLines[Directions.VERTICAL][row][col - 1]
                && row + 1 < selectedLines[Directions.VERTICAL].length && selectedLines[Directions.VERTICAL][row + 1][col - 1]) {
                closedBoxes.push({closed: true, row: col - 1 , col: row, acronym: playerOnTurn.acronym});
            }
            if(col + 1 < selectedLines[Directions.HORIZONTAL][row].length && selectedLines[Directions.HORIZONTAL][row][col + 1]
                && selectedLines[Directions.VERTICAL][row][col]
                && row + 1 < selectedLines[Directions.VERTICAL].length && selectedLines[Directions.VERTICAL][row + 1][col]) {
                closedBoxes.push({closed: true, row: col, col: row, acronym: playerOnTurn.acronym});
            }
        }

        return closedBoxes;
    };

    const gameScore = () => {
        return [
            {playerId: firstPlayer.socket.id, score: firstPlayer.score, acronym: firstPlayer.acronym},
            {playerId: secondPlayer.socket.id, score: secondPlayer.score, acronym: secondPlayer.acronym}
        ];
    };

    const gameEnd = () => {
        gameFinished = true;
        if(playerOnTurn.socket.id === firstPlayer.socket.id) {
            firstPlayer.socket.emit('gameEnd', {message: "You Won!", gameFinished});
            secondPlayer.socket.emit('gameEnd', {message: "You lose...", gameFinished});
        }else {
            firstPlayer.socket.emit('gameEnd', {message: "You lose...", gameFinished});
            secondPlayer.socket.emit('gameEnd', {message: "You Won!", gameFinished})
        }
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