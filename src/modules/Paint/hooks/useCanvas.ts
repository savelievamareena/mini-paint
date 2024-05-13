import { useRef, useState, useEffect, useCallback } from "react";
import { type UseCanvasHookTypes } from "../Paint.types.ts";

export default function useCanvas({ color, lineWidth }: UseCanvasHookTypes) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [snapshot, setSnapshot] = useState<string | undefined>("");

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

    const clearCanvas = useCallback(() => {
        if (contextRef.current && canvasRef.current) {
            contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, []);

    return { canvasRef, contextRef, snapshot, setSnapshot, clearCanvas };
}
