import { HexColorPicker } from "react-colorful";
import { Box, Slider } from "@mui/material";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CropSquare from "@mui/icons-material/CropSquare";
import { DrawMode } from "../../types.ts";

interface DrawingToolsProps {
    drawMode: DrawMode;
    color: string;
    lineWidth: number;
    setColor: (color: string) => void;
    handleSliderChange: (event: Event, value: number | number[]) => void;
    handleModeClick: (mode: DrawMode) => void;
}

const boxStyleRow = {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
};

const DrawingTools = ({
    drawMode,
    color,
    lineWidth,
    setColor,
    handleSliderChange,
    handleModeClick,
}: DrawingToolsProps) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "40px", alignItems: "center" }}>
            <HexColorPicker color={color} onChange={setColor} />
            <Box sx={{ ...boxStyleRow, alignItems: "center" }}>
                <Box sx={{ lineHeight: "1", fontSize: "22px", transform: "translateY(-5%)" }}>
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
                <Box sx={{ lineHeight: "1", fontSize: "72px", transform: "translateY(-10%)" }}>
                    <span>&#8226;</span>
                </Box>
            </Box>
            <Box
                sx={{
                    boxShadow: 2,
                    minWidth: "150px",
                    p: "10px 20px",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "4px",
                    gap: "10px",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <h3>Mode: {drawMode}</h3>
                <BrushOutlinedIcon
                    color='primary'
                    sx={{ fontSize: 40, cursor: "pointer" }}
                    onClick={() => {
                        handleModeClick("brush");
                    }}
                />
                <ArrowOutwardIcon
                    color='primary'
                    sx={{ fontSize: 40, cursor: "pointer" }}
                    onClick={() => {
                        handleModeClick("line");
                    }}
                />
                <CropSquare
                    color='primary'
                    sx={{ fontSize: 40, cursor: "pointer" }}
                    onClick={() => {
                        handleModeClick("square");
                    }}
                />
            </Box>
        </Box>
    );
};

export default DrawingTools;
