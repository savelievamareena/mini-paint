import { HexColorPicker } from "react-colorful";
import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import Container from "@mui/material/Container";

export const Canvas = () => {
    const [color, setColor] = useState("#aabbcc");
    // const [lineCap, setLineCap] = useState<CanvasLineCap>("round");
    // const [lineWidth, setLineWidth] = useState(3);
    const [isDrawing, setIsDrawing] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        if (canvasRef && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            if (context) {
                context.lineCap = "round";
                context.strokeStyle = color;
                context.lineWidth = 3;
                contextRef.current = context;
            }
        }
    }, [color]);

    function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
        const { offsetX, offsetY } = event.nativeEvent;
        if (contextRef && contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
            setIsDrawing(true);
            console.log("Mouse down");
            event.nativeEvent.preventDefault();
        }
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;

        const { offsetX, offsetY } = event.nativeEvent;
        if (contextRef && contextRef.current) {
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
            event.nativeEvent.preventDefault();
            console.log("Drawing");
        }
    }

    function endDrawing() {
        if (contextRef && contextRef.current) {
            contextRef.current.closePath();
            setIsDrawing(false);
            console.log("Mouse up");
        }
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
                    gap: "10px",
                }}
            >
                <Button variant={"outlined"}>Save</Button>
                <Button variant={"outlined"}>Clear</Button>
            </Box>
            <canvas
                style={{
                    border: "2px solid black",
                }}
                width='800'
                height='800'
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
            ></canvas>
            <HexColorPicker color={color} onChange={setColor} />
        </Container>
    );
};
