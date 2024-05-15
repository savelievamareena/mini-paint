import React, { useCallback, useRef } from "react";
import { UseMouseDrawingHandlersProps } from "../Paint.types.ts";

export default function useMouseDrawingHandlers({
    canvasRef,
    contextRef,
    snapshot,
    drawMode,
    clearCanvas,
}: UseMouseDrawingHandlersProps) {
    const startXRef = useRef<number>(0);
    const startYRef = useRef<number>(0);

    const startDrawingHandler = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!startXRef || !startYRef) return;
            if (!contextRef || !contextRef.current) return;

            const { offsetX, offsetY } = event.nativeEvent;
            startXRef.current = offsetX;
            startYRef.current = offsetY;

            contextRef.current.beginPath();
            contextRef.current.moveTo(offsetX, offsetY);
            contextRef.current.lineTo(offsetX, offsetY);
            contextRef.current.stroke();
        },
        [contextRef, startXRef, startYRef],
    );

    const drawHandler = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!contextRef || !contextRef.current) return;
            if (!canvasRef) return;

            const { offsetX, offsetY } = event.nativeEvent;
            if (drawMode === "brush") {
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

                switch (drawMode) {
                    case "line":
                        contextRef.current?.moveTo(startXRef!.current, startYRef!.current);
                        contextRef.current?.lineTo(offsetX, offsetY);
                        break;
                    case "square":
                        contextRef.current?.rect(
                            startXRef!.current,
                            startYRef!.current,
                            offsetX - startXRef!.current,
                            offsetY - startYRef!.current,
                        );
                        break;
                }
                contextRef.current?.stroke();
            };

            return;
        },
        [drawMode, snapshot],
    );

    return { startDrawingHandler, drawHandler, canvasRef };
}
