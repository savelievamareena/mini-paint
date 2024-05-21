import { useCallback, useState } from "react";

export default function useClearConfirmationDialog(
    clearCanvasHandler: () => void,
    resetImageId: () => void,
) {
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = useCallback(() => {
        setDialogOpen(true);
    }, []);

    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handleReset = useCallback(() => {
        clearCanvasHandler();
        resetImageId();
        setDialogOpen(false);
    }, []);

    return { dialogOpen, handleDialogOpen, handleDialogClose, handleReset };
}
