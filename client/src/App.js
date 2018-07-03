import React, { Component } from 'react';
import './App.css';
import Game from "./components/Game";
import SelectLevel from "./components/SelectLevel";
import Loading from "./components/Loading";
import {Levels} from "./common/constants";
import socketClientBuilder from './api/socket';
import Modal from "./components/Modal";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalMessage: "",
            openModal: false,
            searchingGame: false,
            gameStarted: false,
            yourTurn: false,
            acronym: "",
            levelId: "small",
            level: Levels["small"],
            client: socketClientBuilder(),
        };

        this.state.client.registerGameStartHandler((params) => this.initGame(params));
        this.state.client.registerGameEndHandler((params) => this.onGameEnd(params));
    }

    handleAcronymChange = (acronym) => {
        this.setState({acronym})
    };

    handleLevelChange = (levelId) => {
        this.setState({levelId, level: Levels[levelId]});
    };

    findGame = () => {
        const { acronym, level } = this.state;
        this.setState({ searchingGame: true });
        this.state.client.findGame(acronym, level, (err) => {
            if (err)
                return console.error('Error on findGame', err);
        })
    };

    initGame = ({gameId, level, score, playerIdOnTurn, gameStarted}) => {
        const yourTurn = this.state.client.id() === playerIdOnTurn;
        this.setState({gameId, level, score, yourTurn, gameStarted, searchingGame: false});
    };

    onGameEnd = ({message}) => {
        this.setState({modalMessage: message, openModal: true, gameStarted: false});
    };

    closeModal = () => this.setState({openModal: false, modalMessage: ""});

    render() {
        return (
            <div style={{ textAlign: "center" }}>
                {(!this.state.searchingGame && !this.state.gameStarted)
                    && (<SelectLevel
                            acronym={this.state.acronym}
                            levelId={this.state.levelId}
                            handleAcronymChange={this.handleAcronymChange}
                            handleLevelChange={this.handleLevelChange}
                            findGame={this.findGame}
                        />)}
                {(this.state.searchingGame && !this.state.gameStarted) && (<Loading/>)}
                {(!this.state.searchingGame && this.state.gameStarted)
                    && (<Game
                            gameId={this.state.gameId}
                            client={this.state.client}
                            score={this.state.score}
                            yourTurn={this.state.yourTurn}
                            rows={this.state.level.rows}
                            cols={this.state.level.cols}
                        />)}
                <Modal show={this.state.openModal} message={this.state.modalMessage} onClose={this.closeModal}/>
            </div>
        );
    }
}

export default App;
