import { doc, Firestore, getDoc } from "firebase/firestore";
import React from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { toast } from "react-toastify";
import handleDbErrors from "src/helpers/handleDbError";

const fetchImageForEdit = async (
    id: string,
    db: Firestore,
    contextRef: React.RefObject<CanvasRenderingContext2D> | null,
    canvasRef: React.RefObject<HTMLCanvasElement> | null,
) => {
    try {
        const docRef = doc(db, "pics", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const imageId = docSnap.id;

            const storage = getStorage();
            const imageRef = ref(storage, imageId);

            const imageUrl = await getDownloadURL(imageRef);
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = imageUrl;

            img.onload = () => {
                if (contextRef && contextRef.current && canvasRef && canvasRef.current) {
                    contextRef.current.drawImage(
                        img,
                        0,
                        0,
                        canvasRef.current.width,
                        canvasRef.current.height,
                    );
                }
            };
        } else {
            toast.error("No such document!");
        }
    } catch (error) {
        handleDbErrors(error);
    }
};

export default fetchImageForEdit;
