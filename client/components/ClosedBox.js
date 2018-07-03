import React from 'react';
import { Text } from 'react-konva';
import {Colors, Grid} from "../common/constants";

const ClosedBox = ({ acronym, row, col }) => {
    return (
        <Text
            x={ Grid.margin + col * Grid.cellSize }
            y={ Grid.margin + row * Grid.cellSize + Grid.boxMargin }
            text={acronym.substring(0, 2).toUpperCase()}
            align={"center"}
            width={Grid.cellSize}
            fontSize={Grid.boxFontSize}
            fontFamily={Grid.boxFontFamily}
            fill={Colors.boxText}
        />
    );
};

export default ClosedBox;