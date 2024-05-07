import { HexColorPicker } from "react-colorful";
import React, { useEffect, useRef, useState } from "react";
import { ref } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, uploadBytes, db } from "../../firebase.ts";
import { Box, Button, Slider } from "@mui/material";
// import CropSquare from "@mui/icons-material/CropSquare";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
// import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
// import ChangeHistoryRoundedIcon from "@mui/icons-material/ChangeHistoryRounded";
import Container from "@mui/material/Container";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.tsx";

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

    const [color, setColor] = useState("#BF2020");
    const [imageSaved, setImageSaved] = useState(true);
    const [drawMode, setDrawMode] = useState<DrawMode>("regular");
    const [lineWidth, setLineWidth] = useState(15);
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
                context.lineWidth = lineWidth;
                contextRef.current = context;
            }
        }
    }, [color, lineWidth]);

    const handleSliderChange = (_: React.SyntheticEvent | Event, newValue: number | number[]) => {
        if (typeof newValue === "number") {
            setLineWidth(newValue);
        }
    };

    // const startXRef = useRef<number>(0);
    // const startYRef = useRef<number>(0);

    function startDrawing(event: React.MouseEvent<HTMLCanvasElement>) {
        setImageSaved(false);
        const { offsetX, offsetY } = event.nativeEvent;
        if (contextRef && contextRef.current) {
            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
            // startXRef.current = offsetX;
            // startYRef.current = offsetY;
            setIsDrawing(true);
            event.nativeEvent.preventDefault();
        }
    }

    function draw(event: React.MouseEvent<HTMLCanvasElement>) {
        if (!isDrawing) return;

        const { offsetX, offsetY } = event.nativeEvent;

        if (contextRef && contextRef.current) {
            switch (drawMode) {
                case "regular":
                    contextRef.current.lineTo(offsetX, offsetY);
                    contextRef.current.stroke();
                    break;
                // case "line":
                //     if (canvasRef && canvasRef.current) {
                //         contextRef.current.clearRect(
                //             0,
                //             0,
                //             canvasRef.current.width,
                //             canvasRef.current.height,
                //         );
                //         contextRef.current.beginPath();
                //         contextRef.current.moveTo(startXRef, startYRef);
                //         contextRef.current.lineTo(offsetX, offsetY);
                //         contextRef.current.stroke();
                //     }
                //     break;
                // case "square":
                //     if (canvasRef && canvasRef.current) {
                //         contextRef.current.clearRect(
                //             0,
                //             0,
                //             canvasRef.current.width,
                //             canvasRef.current.height,
                //         );
                //         contextRef.current.beginPath();
                //         contextRef.current.rect(
                //             startXRef,
                //             startYRef,
                //             offsetX - startXRef,
                //             offsetY - startYRef,
                //         );
                //         contextRef.current.stroke();
                //     }
                //     break;
            }
            event.nativeEvent.preventDefault();
        }
    }

    function endDrawing() {
        if (contextRef && contextRef.current) {
            contextRef.current.closePath();
            setIsDrawing(false);
        }
    }

    function clearCanvas() {
        setImageSaved(false);
        const canvas = canvasRef.current;
        if (canvas) {
            const context = canvas.getContext("2d");
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                setImageSaved(true);
            }
        }
    }

    function handleModeClick(mode: DrawMode) {
        setDrawMode(mode);
    }

    function saveCanvas() {
        setImageSaved(true);
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
                    {/*<ArrowOutwardIcon*/}
                    {/*    color='primary'*/}
                    {/*    sx={{ fontSize: 40, cursor: "pointer" }}*/}
                    {/*    onCLick={() => {*/}
                    {/*        handleModeClick("line");*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<CropSquare*/}
                    {/*    color='primary'*/}
                    {/*    sx={{ fontSize: 40, cursor: "pointer" }}*/}
                    {/*    onCLick={() => {*/}
                    {/*        handleModeClick("square");*/}
                    {/*    }}*/}
                    {/*/>*/}
                    {/*<ChangeHistoryRoundedIcon*/}
                    {/*    color='primary'*/}
                    {/*    sx={{ fontSize: 40, cursor: "pointer" }}*/}
                    {/*    onCLick={() => {*/}
                    {/*        handleModeCLick("triangle");*/}
                    {/*    }}*/}
                    {/*/>*/}
                </Box>
            </Box>
        </Container>
    );
};
