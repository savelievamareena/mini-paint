import { useRef, useState } from "react";
import { DrawMode } from "../Paint.types.ts";

export default function useDrawing(initialLineWidth = 15, initialDrawMode: DrawMode = "brush") {
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState<DrawMode>(initialDrawMode);
    const [lineWidth, setLineWidth] = useState(initialLineWidth);
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);

    return {
        isDrawing,
        setIsDrawing,
        drawMode,
        setDrawMode,
        lineWidth,
        setLineWidth,
        startXRef,
        startYRef,
    };
}
