import React, { useEffect, useState } from "react";
import { useAuth } from "src/context/AuthContext";
import DrawingTools from "./components/DrawingTools/DrawingTools";
import { Canvas } from "./components/Canvas";
import { Box, Button, Container } from "@mui/material";
import { DrawMode } from "./Paint.types";
import { useImageStorage, useMouseDrawingHandlers, useCanvas, useDrawing } from "./hooks";
import { paintButtonsWrapper, paintWrapper } from "./Paint.styles";
import { ConfirmationDialog } from "src/components/ConfirmationDialog";
import useClearConfirmationDialog from "./hooks/useClearConfirmationDialog";
import { useParams } from "react-router-dom";
import { db } from "firebase";
import fetchImageForEdit from "./helpers/fetchImageForEdit";

const Paint = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const [color, setColor] = useState("#BF2020");

    const { isDrawing, setIsDrawing, drawMode, setDrawMode, lineWidth, setLineWidth } =
        useDrawing();

    const { canvasRef, contextRef, snapshot, setSnapshot, clearCanvas } = useCanvas({
        color,
        lineWidth,
    });

    const { isSaveButtonDisabled, setSaveButtonDisabled, saveCanvas, resetImageId } =
        useImageStorage(currentUser, id);

    const { startDrawingHandler, drawHandler } = useMouseDrawingHandlers({
        canvasRef,
        contextRef,
        clearCanvas,
        drawMode,
        snapshot,
    });

    const { dialogOpen, handleDialogOpen, handleDialogClose, handleReset } =
        useClearConfirmationDialog(clearCanvasHandler, resetImageId, id);

    useEffect(() => {
        if (id) {
            fetchImageForEdit(id, db, contextRef, canvasRef);
        } else {
            clearCanvas();
        }
    }, [id, currentUser, db, contextRef, canvasRef]);

    const handleSliderChange = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setLineWidth(newValue);
        }
    };

    function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
        setSaveButtonDisabled(false);
        startDrawingHandler(event);
        setSnapshot(canvasRef.current?.toDataURL());
        setIsDrawing(true);
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;
        drawHandler(event);
    }

    function clearCanvasHandler() {
        clearCanvas();
        setSaveButtonDisabled(true);
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
                    disabled={isSaveButtonDisabled}
                >
                    Save
                </Button>
                <Button variant={"outlined"} onClick={handleDialogOpen}>
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

            <ConfirmationDialog
                handleClose={handleDialogClose}
                open={dialogOpen}
                title={"Are you sure you want to clear canvas?"}
            >
                <Button variant='contained' onClick={handleReset} sx={{ marginRight: "20px" }}>
                    YES
                </Button>
                <Button variant='outlined' onClick={handleDialogClose}>
                    NO
                </Button>
            </ConfirmationDialog>
        </Container>
    );
};

export default Paint;
