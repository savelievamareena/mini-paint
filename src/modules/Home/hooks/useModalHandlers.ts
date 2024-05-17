import { useCallback, useState } from "react";

export default function useModalHandlers() {
    const [picToShow, setPicToShow] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = useCallback((id: string) => {
        setPicToShow(
            `https://firebasestorage.googleapis.com/v0/b/paint-43c73.appspot.com/o/${id}?alt=media`,
        );
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setPicToShow("");
    }, []);

    return { handleModalOpen, handleModalClose, picToShow, modalOpen };
}
