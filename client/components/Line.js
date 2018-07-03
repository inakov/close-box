import React, {Component} from 'react';
import { Line as KonvaLine } from 'react-konva';
import { Colors, Grid, Directions } from "../common/constants";

export default class Line extends Component {

    linePoints = [];

    state = {
        selected: false,
        hovered: false,
    };

    constructor(props) {
        super(props);
        const { direction, row, col, selected } = props;
        this.linePoints = this.drawLine(direction, row, col);
        this.state.selected = selected;
    }

    componentWillReceiveProps(newProps){
        if (this.state.selected !== newProps.selected) {
            this.setState({ selected: newProps.selected })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.hovered !== nextState.hovered || this.state.selected !== nextState.selected;
    }

    drawLine = (direction, row, col) => {
        let points = [];

        if (direction === Directions.HORIZONTAL) {
            const x1 = row * Grid.cellSize + Grid.margin;
            const y1 = col * Grid.cellSize + Grid.margin;
            const x2 = x1 + Grid.cellSize;
            const y2 = y1;
            points = [x1, y1, x2, y2];
        } else if(direction === Directions.VERTICAL) {
            const x1 = row * Grid.cellSize + Grid.margin;
            const y1 = col * Grid.cellSize + Grid.margin;
            const x2 = x1;
            const y2 = y1 + Grid.cellSize;
            points = [x1, y1, x2, y2];
        }

        return points;
    };

    handleMouseOver = () => {
        if(this.props.active){
            this.setState({ hovered: true });
        }
    };

    handleMouseOut = () => {
        if(this.props.active){
            this.setState({ hovered: false });
        }
    };

    handleSelectLine = () => {
        if(this.props.active){
            this.setState({ selected: true, hovered: false });
            this.props.onSelect()
        }
    };

    render() {
        let opacity =  this.state.selected ? 1.0 : this.state.hovered ? 0.3 : 0.0;
        return (
            <KonvaLine
                key={this.props.id}
                points={this.linePoints}
                stroke={Colors.line}
                strokeWidth={Grid.lineWidth}
                opacity={opacity}
                onMouseEnter={this.handleMouseOver}
                onMouseLeave={this.handleMouseOut}
                onClick={this.handleSelectLine}
            />
        );
    }

}