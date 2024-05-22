import { useCallback, useState } from "react";

export default function useModalHandlers() {
    const basePicUrl = import.meta.env.VITE_PICTURE_PATH;
    const [picToShow, setPicToShow] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const handleModalOpen = useCallback((id: string) => {
        setPicToShow(`${basePicUrl}${id}?alt=media`);
        setModalOpen(true);
    }, []);

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setPicToShow("");
    }, []);

    return { handleModalOpen, handleModalClose, picToShow, modalOpen };
}
