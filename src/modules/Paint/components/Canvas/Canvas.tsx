import { CanvasProps } from "./Canvas.types.ts";

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
