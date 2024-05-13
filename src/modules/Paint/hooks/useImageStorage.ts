import { useCallback, useState, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref } from "firebase/storage";
import { toast } from "react-toastify";
import saveImageToStorage from "../helpers/saveImageToStorage.ts";
import { User } from "firebase/auth";
import { storage } from "../../../../firebase.ts";

export default function useImageStorage(currentUser: User | null) {
    const [imageSaved, setImageSaved] = useState(true);
    const [imageId, setImageId] = useState(uuidv4());

    const saveCanvas = useCallback(
        (canvasRef: RefObject<HTMLCanvasElement>) => {
            if (!canvasRef.current) return;

            setImageSaved(true);
            canvasRef.current.toBlob(function (blob) {
                if (!blob) return;
                const imagesRef = ref(storage, imageId);

                try {
                    saveImageToStorage(imagesRef, blob, currentUser, imageId).then((result) => {
                        if (result) {
                            toast.success("Image uploaded successfully!");
                        } else {
                            setImageSaved(false);
                            toast.error("Failed to save record.");
                        }
                    });
                } catch (error: unknown) {
                    setImageSaved(false);
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

    return { imageSaved, setImageSaved, imageId, saveCanvas, resetImageId };
}
