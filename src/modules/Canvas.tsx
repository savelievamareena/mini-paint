import React from "react";

type CanvasProps = {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    startDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    draw: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    endDrawing: (e: React.MouseEvent<HTMLCanvasElement>) => void;
    color: string;
};

const Canvas = ({ canvasRef, startDrawing, draw, endDrawing, color }: CanvasProps) => {
    return (
        <canvas
            style={{
                border: `4px solid ${color}`,
            }}
            width='800'
            height='800'
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
        ></canvas>
    );
};

export default Canvas;
