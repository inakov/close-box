
const makeHandleEvent = (client) => {
    const  ensureExists = (getter, rejectionMessage) => {
        return new Promise(function (resolve, reject) {
            const res = getter();
            return res
                ? resolve(res)
                : reject(rejectionMessage)
        })
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

module.exports = function (client) {
    const handleSelectLine = ({ gameId, line } = {}, callback) => {
        handleEvent(gameId, line)
            .then(() => callback(null))
            .catch(callback)
    };

    return {
        handleFindGame,
        handleSelectLine,
        handleDisconnect
    }
};