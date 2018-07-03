import React, { PureComponent } from 'react';
import { Stage, Layer } from 'react-konva';
import Dot from "./Dot";
import {Directions, Grid} from "../common/constants";
import Line from "./Line";
import ClosedBox from "./ClosedBox";
import ScoreBoard from "./ScoreBoard";

export default class Game extends PureComponent {

    constructor(props) {
        super(props);
        const { gameId, yourTurn, rows, cols, client, score } = this.props;

        const dots = this.prepareDots(rows, cols);
        const linesById = this.prepareLines(rows, cols);
        this.state = {gameId, dots, linesById, client, yourTurn, turnId: 0, boxes: [], score};
        client.registerTurnOutcomeHandler(this.handleTurnOutcome);
    }

    prepareDots = (rows, cols) => {
        let dots = [];
        for(let i=0; i<= rows; i++) {
            for(let j=0; j <= cols; j++) {
                dots.push({row: i, col: j})
            }
        }
        return dots;
    };

    prepareLines = (rows, cols) => {
        const horizontalLines = this.prepareHoizontalLines(rows, cols);
        const verticalLines = this.prepareVerticalLines(rows, cols);

        return Object.assign(horizontalLines, verticalLines);
    };

    prepareHoizontalLines = (rows, cols) => {
        let lines = {};
        const builder = this.buildLine(Directions.HORIZONTAL);
        for(let i=0; i < rows; i++) {
            for(let j=0; j <= cols; j++) {
                const line = builder(i, j);
                lines[line.id] = line;
            }
        }

        return lines;
    };

    prepareVerticalLines = (rows, cols) => {
        const lines = {};
        const builder = this.buildLine(Directions.VERTICAL);
        for(let i=0; i <= rows; i++) {
            for(let j=0; j < cols; j++) {
                const line = builder(i, j);
                lines[line.id] = line;
            }
        }

        return lines;
    };

    buildLine = (direction) => (row, col) => {
        const id  = direction + ":" + row + "x" + col;
        const selected = false;
        return { id, direction, row, col, selected };
    };

    lineSelected = (selectedLine) => {
        const newLine = {...selectedLine, selected: true};
        this.state.client.selectLine(this.state.gameId, newLine, (err) => {
            if (err)
                return console.error('Error on selectLine', err);
        });
    };

    handleTurnOutcome = ({
                             turnId,
                             selectedLine,
                             playerIdOnTurn,
                             gameFinished,
                             closedBoxes,
                             score,
    }) => {
        const yourTurn = this.state.client.id() === playerIdOnTurn;
        const selectedLines = {...this.state.linesById};
        selectedLines[selectedLine.id] = {...selectedLines[selectedLine.id], selected: true };

        this.setState({
            turnId,
            score,
            yourTurn,
            gameFinished,
            linesById: selectedLines,
            boxes: [...this.state.boxes, ...closedBoxes]
        });
    };

    render() {
        const width = this.props.cols * Grid.cellSize + (Grid.margin * 2);
        const height = this.props.rows * Grid.cellSize + (Grid.margin * 2);
        return (
            <div>
                <h2 className="game-text">close the box and kick some asses</h2>
                { this.state.yourTurn ? (<h2 className="pulsate">it's your turn!</h2>) : (<h2 className="pulsate">opponent's turn!</h2>)}
            <Stage width={width} height={height}>
                <Layer>
                    {Object.values(this.state.linesById).map((line) => <Line key={line.id} {...line} active={this.state.yourTurn} onSelect={() => this.lineSelected(line)} />)}
                </Layer>
                <Layer>
                    {this.state.dots.map((dot, index) => <Dot key={index} row={dot.row} col={dot.col}/>)}
                </Layer>
                <Layer>
                    {this.state.boxes.map((box, index) => <ClosedBox key={index} row={box.row} col={box.col} acronym={box.acronym}/>)}
                </Layer>
            </Stage>
            <ScoreBoard score={this.state.score} />
            </div>
        );
    }
}