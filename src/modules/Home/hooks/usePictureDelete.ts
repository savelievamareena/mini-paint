import { deleteDoc, doc, DocumentData } from "firebase/firestore";
import { db } from "firebase";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction, useCallback } from "react";

export default function usePictureDelete(
    setPicturesData: Dispatch<SetStateAction<DocumentData[]>>,
    incrementDeletedCount: () => void,
) {
    const handleDelete = useCallback(
        async (id: string) => {
            const docRef = doc(db, "pics", id);
            try {
                await deleteDoc(docRef);
                setPicturesData((prevState) => {
                    if (prevState !== undefined) {
                        return prevState.filter((image: DocumentData) => image.id !== id);
                    }
                    return prevState;
                });
                incrementDeletedCount();
            } catch {
                toast.error("Could not delete the image");
            }
        },
        [setPicturesData, incrementDeletedCount],
    );

    return { handleDelete };
}
