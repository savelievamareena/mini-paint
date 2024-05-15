import React from "react";

export type DrawMode = "brush" | "line" | "square";

export type DrawingToolsProps = {
    drawMode: DrawMode;
    color: string;
    lineWidth: number;
    setColor: (color: string) => void;
    handleSliderChange: (event: Event, value: number | number[]) => void;
    handleModeClick: (mode: DrawMode) => void;
};

export type UseCanvasHookTypes = {
    color: string;
    lineWidth: number;
};

export type UseMouseDrawingHandlersProps = {
    canvasRef: React.RefObject<HTMLCanvasElement> | null;
    contextRef: React.RefObject<CanvasRenderingContext2D> | null;
    snapshot: string | undefined;
    drawMode: DrawMode;
    clearCanvas: () => void;
};
