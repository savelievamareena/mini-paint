import { useCallback, useState, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref } from "firebase/storage";
import { User } from "firebase/auth";
import { storage } from "firebase";
import { toast } from "react-toastify";
import saveImageToStorage from "../helpers/saveImageToStorage";

export default function useImageStorage(currentUser: User | null) {
    const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [imageId, setImageId] = useState(uuidv4());

    const saveCanvas = useCallback(
        (canvasRef: RefObject<HTMLCanvasElement>) => {
            if (!canvasRef.current) return;

            setSaveButtonDisabled(true);
            canvasRef.current.toBlob(function (blob) {
                if (!blob) return;
                const imagesRef = ref(storage, imageId);

                try {
                    saveImageToStorage(imagesRef, blob, currentUser, imageId).then((result) => {
                        if (result) {
                            toast.success("Image uploaded successfully!");
                        } else {
                            setSaveButtonDisabled(false);
                            toast.error("Failed to save record.");
                        }
                    });
                } catch (error: unknown) {
                    setSaveButtonDisabled(false);
                    if (error instanceof Error) {
                        toast.error(`An error occurred: ${error.message}`);
                    } else {
                        toast.error("An unknown error occurred");
                    }
                }
            });
        },
        [currentUser, imageId],
    );

    const resetImageId = useCallback(() => {
        const newImageId = uuidv4();
        setImageId(newImageId);
    }, []);

    return { isSaveButtonDisabled, setSaveButtonDisabled, imageId, saveCanvas, resetImageId };
}
