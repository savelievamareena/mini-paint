export type DrawMode = "brush" | "line" | "square";

export type DrawingToolsProps = {
    drawMode: DrawMode;
    color: string;
    lineWidth: number;
    setColor: (color: string) => void;
    handleSliderChange: (event: Event, value: number | number[]) => void;
    handleModeClick: (mode: DrawMode) => void;
};
