import React, { useState } from "react";
import { useAuth } from "src/context/AuthContext";
import DrawingTools from "./components/DrawingTools/DrawingTools";
import { Canvas } from "./components/Canvas";
import { Box, Button, Container } from "@mui/material";
import { DrawMode } from "./Paint.types";
import { useImageStorage, useMouseDrawingHandlers, useCanvas, useDrawing } from "./hooks";
import { paintButtonsWrapper, paintWrapper } from "./Paint.styles";

const Paint = () => {
    const { currentUser } = useAuth();
    const [color, setColor] = useState("#BF2020");

    const { isDrawing, setIsDrawing, drawMode, setDrawMode, lineWidth, setLineWidth } =
        useDrawing();

    const { canvasRef, contextRef, snapshot, setSnapshot, clearCanvas } = useCanvas({
        color,
        lineWidth,
    });

    const { imageSaved, setImageSaved, saveCanvas, resetImageId } = useImageStorage(currentUser);

    const { startDrawingHandler, drawHandler } = useMouseDrawingHandlers({
        canvasRef,
        contextRef,
        clearCanvas,
        drawMode,
        snapshot,
    });

    const handleSliderChange = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setLineWidth(newValue);
        }
    };

    function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
        setImageSaved(false);
        startDrawingHandler(event);
        setSnapshot(canvasRef.current?.toDataURL());
        setIsDrawing(true);
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;
        drawHandler(event);
    }

    function clearCanvasHandler() {
        setImageSaved(false);
        clearCanvas();
        setImageSaved(true);
    }

    function handleReset() {
        clearCanvasHandler();
        resetImageId();
    }

    function handleModeClick(mode: DrawMode) {
        setDrawMode(mode);
    }

    return (
        <Container sx={paintWrapper}>
            <Box sx={paintButtonsWrapper}>
                <Button
                    variant={"outlined"}
                    onClick={() => {
                        saveCanvas(canvasRef);
                    }}
                    disabled={imageSaved}
                >
                    Save
                </Button>
                <Button variant={"outlined"} onClick={handleReset}>
                    Clear
                </Button>
            </Box>

            <Canvas
                canvasRef={canvasRef}
                startDrawing={startDrawing}
                draw={draw}
                endDrawing={() => {
                    setIsDrawing(false);
                }}
                color={color}
            />
            <DrawingTools
                drawMode={drawMode}
                lineWidth={lineWidth}
                handleSliderChange={handleSliderChange}
                color={color}
                setColor={setColor}
                handleModeClick={handleModeClick}
            />
        </Container>
    );
};

export default Paint;
