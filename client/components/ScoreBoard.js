import React from 'react';

const ScoreBoard = ({score}) => {
    return (
        <div>
            <ul>
                {
                    score.map(playerResult => <li key={playerResult.playerId} >{playerResult.acronym} - {playerResult.score}</li>)
                }
            </ul>
        </div>
    );
};



export default ScoreBoard;