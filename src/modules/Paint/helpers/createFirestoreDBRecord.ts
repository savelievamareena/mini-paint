import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "firebase";
import { DocumentData } from "firebase/firestore";

export default function createFirestoreDBRecord(
    tableName: string,
    id: string,
    record: DocumentData,
): Promise<boolean> {
    return setDoc(doc(db, tableName, id), record)
        .then(() => {
            return true;
        })
        .catch(() => {
            toast.error("Upload to the DB failed!");
            return false;
        });
}
