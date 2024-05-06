import { HexColorPicker } from "react-colorful";
import React, { useEffect, useRef, useState } from "react";
import { ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, uploadBytes, db } from "../../firebase.ts";
import { Box, Button } from "@mui/material";
import Container from "@mui/material/Container";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.tsx";

export const Canvas = () => {
    const { currentUser } = useAuth();

    const [color, setColor] = useState("#aabbcc");
    const [imageSaved, setImageSaved] = useState(false);
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
        setImageSaved(false);
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

    function clearCanvas() {
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                setImageSaved(false);
            }
        }
    }

    function saveCanvas() {
        if (canvasRef && !imageSaved) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            canvas.toBlob(function (blob) {
                if (!blob) return;

                const creationDate = Date.now();
                const uuid = creationDate.toString(36);
                const imagesRef = ref(storage, uuid);

                uploadBytes(imagesRef, blob)
                    .then(() => {
                        const imageUrl = URL.createObjectURL(blob);
                        const dbRecord = {
                            user: currentUser?.email,
                            userId: currentUser?.uid,
                            url: imageUrl,
                            createdAt: creationDate,
                        };

                        setDoc(doc(db, "pics", uuid), dbRecord)
                            .then(() => {
                                setImageSaved(true);
                                URL.revokeObjectURL(imageUrl);
                                toast.success("Image uploaded to DB!");
                            })
                            .catch(() => {
                                toast.error("Upload to the DB failed!");
                            });
                    })
                    .catch(() => {
                        toast.error("Upload to the storage failed!");
                    });
            });
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
                <Button variant={"outlined"} onClick={saveCanvas} disabled={imageSaved}>
                    Save
                </Button>
                <Button variant={"outlined"} onClick={clearCanvas}>
                    Clear
                </Button>
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
