import React from "react";

export type CanvasProps = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    endDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    color: string;
};
