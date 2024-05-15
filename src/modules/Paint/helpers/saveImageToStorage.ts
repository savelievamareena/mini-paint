import { uploadBytes, StorageReference } from "firebase/storage";
import createFirestoreDBRecord from "./createFirestoreDBRecord";
import { User } from "firebase/auth";

export default function saveImageToStorage(
    imagesRef: StorageReference,
    blob: Blob,
    currentUser: User | null,
    imageId: string,
): Promise<boolean> {
    return uploadBytes(imagesRef, blob)
        .then(() => {
            const imageUrl = URL.createObjectURL(blob);
            if (currentUser) {
                const dbRecord = {
                    userEmail: currentUser.email,
                    userId: currentUser.uid,
                    url: imageUrl,
                    createdAt: Date.now(),
                };

                return createFirestoreDBRecord("pics", imageId, dbRecord).then((saveToDBResult) => {
                    URL.revokeObjectURL(imageUrl);
                    return saveToDBResult;
                });
            }
            return false;
        })
        .catch(() => {
            throw new Error("Upload to storage failed");
        });
}
