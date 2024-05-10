import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext.tsx";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { ref } from "firebase/storage";
import { storage } from "../../../firebase.ts";
import saveImageToStorage from "./helpers/saveImageToStorage.ts";
import DrawingTools from "./components/DrawingTools/DrawingTools.tsx";
import { Canvas } from "./components/Canvas";
import { Box, Button, Container } from "@mui/material";
import { DrawMode } from "./Paint.types.ts";

const Paint = () => {
    const { currentUser } = useAuth();

    const [isDrawing, setIsDrawing] = useState(false);
    const [imageSaved, setImageSaved] = useState(true);

    const [color, setColor] = useState("#BF2020");
    const [drawMode, setDrawMode] = useState<DrawMode>("brush");
    const [lineWidth, setLineWidth] = useState(15);
    const [snapshot, setSnapshot] = useState<string | undefined>("");
    const [imageId, setImageId] = useState(uuidv4());

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
            context.lineCap = "round";
            context.lineJoin = "round";
            context.strokeStyle = color;
            context.lineWidth = lineWidth;
            contextRef.current = context;
        }
    }, [color, lineWidth]);

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

        if (contextRef && contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
            setSnapshot(canvasRef.current?.toDataURL());
            setIsDrawing(true);
        }
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;
        const { offsetX, offsetY } = event.nativeEvent;

        if (contextRef && contextRef.current) {
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

                clearCanvas();
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
    }

    function endDrawing() {
        setIsDrawing(false);
    }

    function clearCanvas() {
        setImageSaved(false);
        if (contextRef.current && canvasRef.current) {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setImageSaved(true);
        }
    }

    function handleClearCanvas() {
        clearCanvas();
        const newImageId = uuidv4();
        setImageId(newImageId);
    }

    function handleModeClick(mode: DrawMode) {
        setDrawMode(mode);
    }

    function saveCanvas() {
        if (imageSaved || !canvasRef) return;

        setImageSaved(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.toBlob(function (blob) {
            if (!blob) return;
            const imagesRef = ref(storage, imageId);

            try {
                saveImageToStorage(imagesRef, blob, currentUser, imageId).then((result) => {
                    if (result) {
                        setImageSaved(true);
                        toast.success("Image uploaded successfully!");
                    } else {
                        setImageSaved(false);
                        toast.error("Failed to save record.");
                    }
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    setImageSaved(false);
                    toast.error(error.message);
                } else {
                    toast.error("An unknown error occurred");
                }
            }
        });
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
                <Button variant={"outlined"} onClick={saveCanvas} disabled={imageSaved}>
                    Save
                </Button>
                <Button variant={"outlined"} onClick={handleClearCanvas}>
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
