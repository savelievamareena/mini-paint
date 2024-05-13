import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import DrawingTools from "./components/DrawingTools/DrawingTools.tsx";
import { Canvas } from "./components/Canvas";
import { Box, Button, Container } from "@mui/material";
import { DrawMode } from "./Paint.types.ts";
import useCanvas from "./hooks/useCanvas.ts";
import useDrawing from "./hooks/useDrawing.ts";
import useImageStorage from "./hooks/useImageStorage.ts";

const Paint = () => {
    const { currentUser } = useAuth();
    const [color, setColor] = useState("#BF2020");

    const {
        isDrawing,
        setIsDrawing,
        drawMode,
        setDrawMode,
        lineWidth,
        setLineWidth,
        startXRef,
        startYRef,
    } = useDrawing();

    const { canvasRef, contextRef, snapshot, setSnapshot, clearCanvas } = useCanvas({
        color,
        lineWidth,
    });

    const { imageSaved, setImageSaved, saveCanvas, resetImageId } = useImageStorage(currentUser);

    const handleSliderChange = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setLineWidth(newValue);
        }
    };

    function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
        setImageSaved(false);

        const { offsetX, offsetY } = event.nativeEvent;
        startXRef.current = offsetX;
        startYRef.current = offsetY;

        if (!contextRef || !contextRef.current) return;

        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
        setSnapshot(canvasRef.current?.toDataURL());
        setIsDrawing(true);
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;
        if (!contextRef || !contextRef.current) return;

        const { offsetX, offsetY } = event.nativeEvent;

        if (drawMode === "brush") {
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
            return;
        }

        const img = new Image();
        if (!snapshot) return;

        img.src = snapshot;
        img.onload = () => {
            if (!canvasRef.current) return;

            clearCanvasHandler();
            contextRef.current?.drawImage(
                img,
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height,
            );
            contextRef.current?.beginPath();
            setImageSaved(false);

            switch (drawMode) {
                case "line":
                    contextRef.current?.moveTo(startXRef.current, startYRef.current);
                    contextRef.current?.lineTo(offsetX, offsetY);
                    break;
                case "square":
                    contextRef.current?.rect(
                        startXRef.current,
                        startYRef.current,
                        offsetX - startXRef.current,
                        offsetY - startYRef.current,
                    );
                    break;
            }
            contextRef.current?.stroke();
        };
    }

    function endDrawing() {
        setIsDrawing(false);
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
        <Container
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                p: "30px",
                gap: "30px",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
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
                endDrawing={endDrawing}
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
