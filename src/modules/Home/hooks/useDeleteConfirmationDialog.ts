import { useCallback, useState } from "react";

export default function useDeleteConfirmationDialog(handleDelete: (id: string) => void) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [picToDelete, setPicToDelete] = useState("-1");

    const handleDialogOpen = useCallback((id: string) => {
        setPicToDelete(id);
        setDialogOpen(true);
    }, []);
    const handleDialogClose = useCallback(() => {
        setDialogOpen(false);
    }, []);

    const handlePictureDelete = useCallback(() => {
        handleDelete(picToDelete);
        setDialogOpen(false);
    }, [picToDelete]);

    return { dialogOpen, handleDialogOpen, handleDialogClose, handlePictureDelete };
}
