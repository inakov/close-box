import React from 'react';
import { Circle } from 'react-konva';
import {Colors, Grid} from "../common/constants";

const Dot = ({row, col}) => {
    return (
        <Circle
            x={ row * Grid.cellSize + 20 }
            y={ col * Grid.cellSize + 20 }
            radius={Grid.dotRadius}
            fill={Colors.dot}
        />
    );
};

export default Dot;