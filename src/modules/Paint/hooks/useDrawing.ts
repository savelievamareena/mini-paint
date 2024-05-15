import { useState } from "react";
import { DrawMode } from "../Paint.types";

export default function useDrawing(initialLineWidth = 15, initialDrawMode: DrawMode = "brush") {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState<DrawMode>(initialDrawMode);
    const [lineWidth, setLineWidth] = useState(initialLineWidth);

    return {
        isDrawing,
        setIsDrawing,
        drawMode,
        setDrawMode,
        lineWidth,
        setLineWidth,
    };
}
