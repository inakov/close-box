
const makeHandleEvent = (client, gameManager) => {
    const  ensureExists = (getter, rejectionMessage) => {
        return new Promise(function (resolve, reject) {
            const res = getter();
            return res
                ? resolve(res)
                : reject(rejectionMessage)
        })
    };

    const ensureActiveGame = (gameId) => {
        return ensureExists(
            () => gameManager.getGameById(gameId),
            `invalid game id: ${gameId}`
        )
    };

    const ensurePlayersTurn = (gameId) => {
        return ensureExists(
            () => gameManager.getGameById(gameId),
            `invalid game id: ${gameId}`
        )
    };

    //TODO: Ensure players turn!
    const ensureValidGame = (gameId) => {
        return Promise.all([
            ensureActiveGame(gameId)
        ]).then(([game]) => Promise.resolve({ game }))
    };

    const handleEvent = (gameId, line) => {
        return ensureValidGame(gameId)
            .then(function ({ game }) {
                game.selectLine(client, line);

                return game;
            })
    };

    return handleEvent
};

module.exports = function (client, gameManager) {
    const handleEvent = makeHandleEvent(client, gameManager);

    const handleFindGame = (userName, level, callback) => {
        gameManager.findGame(client, userName,level);

        return callback();
    };

    const handleSelectLine = ({ gameId, line } = {}, callback) => {
        handleEvent(gameId, line)
            .then(() => callback(null))
            .catch(callback)
    };

    const handleDisconnect = () => {
        // remove player
        gameManager.removePlayer(client);
    };

    return {
        handleFindGame,
        handleSelectLine,
        handleDisconnect
    }
};