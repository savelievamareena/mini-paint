import { HexColorPicker } from "react-colorful";
import { DrawingToolsProps } from "../../Paint.types";
import { Box, Slider } from "@mui/material";
import { CropSquare, ArrowOutward, BrushOutlined } from "@mui/icons-material";
import {
    drawingToolsWrapperStyles,
    sliderBoxStyles,
    toolsSelectionBoxStyles,
    sliderLeftDotStyles,
    sliderRightDotStyles,
    toolsSelectionButtonStyles,
} from "./DrawingTools.styles.ts";

const DrawingTools = ({
    drawMode,
    color,
    lineWidth,
    setColor,
    handleSliderChange,
    handleModeClick,
}: DrawingToolsProps) => {
    return (
        <Box sx={drawingToolsWrapperStyles}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box sx={sliderBoxStyles}>
                <Box sx={sliderLeftDotStyles}>
                    <span>&#8226;</span>
                </Box>
                <Slider
                    defaultValue={lineWidth}
                    value={lineWidth}
                    valueLabelDisplay='auto'
                    onChange={handleSliderChange}
                    min={1}
                    max={50}
                    sx={{
                        width: 200,
                        color: color,
                    }}
                />
                <Box sx={sliderRightDotStyles}>
                    <span>&#8226;</span>
                </Box>
            </Box>
            <Box sx={toolsSelectionBoxStyles}>
                <h3>Mode: {drawMode}</h3>
                <BrushOutlined
                    color='primary'
                    sx={toolsSelectionButtonStyles}
                    onClick={() => {
                        handleModeClick("brush");
                    }}
                />
                <ArrowOutward
                    color='primary'
                    sx={toolsSelectionButtonStyles}
                    onClick={() => {
                        handleModeClick("line");
                    }}
                />
                <CropSquare
                    color='primary'
                    sx={toolsSelectionButtonStyles}
                    onClick={() => {
                        handleModeClick("square");
                    }}
                />
            </Box>
        </Box>
    );
};

export default DrawingTools;
