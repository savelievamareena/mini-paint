import { useCallback, useState, RefObject } from "react";
import { v4 as uuidv4 } from "uuid";
import { ref } from "firebase/storage";
import { User } from "firebase/auth";
import { storage } from "firebase";
import { toast } from "react-toastify";
import saveImageToStorage from "../helpers/saveImageToStorage";
import handleDbErrors from "src/helpers/handleDbError";

export default function useImageStorage(currentUser: User | null, id: string | undefined) {
    const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(true);
    const [imageId, setImageId] = useState(id ? id : uuidv4());

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
                    handleDbErrors(error);
                }
            });
        },
        [currentUser, imageId, id],
    );

    const resetImageId = useCallback(() => {
        const newImageId = uuidv4();
        setImageId(newImageId);
    }, []);

    return { isSaveButtonDisabled, setSaveButtonDisabled, imageId, saveCanvas, resetImageId };
}
