const Game = require('./Game');
const uuid = require('node-uuid');

module.exports = function() {

    const games = new Map();
    const awaitingPlayers = new Map();

    const getGameById = (gameId) => {
        return games.get(gameId)
    };

    const removePlayer = (client) => {
        clearAwaitingPlayers(client.id);
        games.forEach(g => g.removePlayer(client));
    };

    const clearAwaitingPlayers = (playerId) => {
        let keysToRemove = [];
        for(let [key, player] of awaitingPlayers) {
            if(player.socket.id === playerId) {
                keysToRemove.push(key)
            }
        }
        for(let key of keysToRemove) {
            awaitingPlayers.delete(key);
        }
    };

    const findGame = (client, acronym, level) => {
        const awaitingPlayer = awaitingPlayers.get(level.id);
        if(awaitingPlayer) {
            const newPlayer = createPlayer(acronym, client);
            const gameId = uuid.v4();
            //TODO: Create new game instance
            awaitingPlayers.delete(level.id);

        }else {
            const newPlayer = createPlayer(acronym, client);
            awaitingPlayers.set(level.id, newPlayer);
        }
    };

    const createPlayer = (acronym, socket) => {
        return {
            acronym,
            socket,
            score: 0,
        }
    };

    return {
        removePlayer,
        getGameById,
        findGame,
    };
};