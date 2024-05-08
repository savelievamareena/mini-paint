import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HexColorPicker } from "react-colorful";
import { toast } from "react-toastify";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext.tsx";
import { storage, db } from "../../firebase.ts";
import { Box, Button, Slider } from "@mui/material";
import Container from "@mui/material/Container";
import CropSquare from "@mui/icons-material/CropSquare";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

type DrawMode = "regular" | "line" | "square";

const boxStyleColumn = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const boxStyleRow = {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    alignItems: "center",
    justifyContent: "center",
};

export const Canvas = () => {
    const { currentUser } = useAuth();

    const [isDrawing, setIsDrawing] = useState(false);
    const [imageSaved, setImageSaved] = useState(true);

    const [color, setColor] = useState("#BF2020");
    const [drawMode, setDrawMode] = useState<DrawMode>("regular");
    const [lineWidth, setLineWidth] = useState(15);
    const [snapshot, setSnapshot] = useState<string | undefined>("");
    const [imageId, setImageId] = useState("");

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

    useEffect(() => {
        setImageId(uuidv4());
    }, []);

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
            if (drawMode === "regular") {
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

            const creationDate = Date.now();
            const imagesRef = ref(storage, imageId);

            uploadBytes(imagesRef, blob)
                .then(() => {
                    const imageUrl = URL.createObjectURL(blob);
                    const dbRecord = {
                        user: currentUser?.email,
                        userId: currentUser?.uid,
                        url: imageUrl,
                        createdAt: creationDate,
                    };

                    setDoc(doc(db, "pics", imageId), dbRecord)
                        .then(() => {
                            URL.revokeObjectURL(imageUrl);
                            toast.success("Image uploaded to DB!");
                        })
                        .catch(() => {
                            toast.error("Upload to the DB failed!");
                            setImageSaved(false);
                        });
                })
                .catch(() => {
                    toast.error("Upload to the storage failed!");
                    setImageSaved(false);
                });
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
            <Box sx={boxStyleColumn}>
                <h3>{drawMode}</h3>
                <Button variant={"outlined"} onClick={saveCanvas} disabled={imageSaved}>
                    Save
                </Button>
                <Button variant={"outlined"} onClick={handleClearCanvas}>
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
            <Box sx={{ ...boxStyleColumn, gap: "40px", alignItems: "center" }}>
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
                        p: "10px",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "4px",
                        gap: "10px",
                    }}
                >
                    <BrushOutlinedIcon
                        color='primary'
                        sx={{ fontSize: 40, cursor: "pointer" }}
                        onClick={() => {
                            handleModeClick("regular");
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
        </Container>
    );
};
