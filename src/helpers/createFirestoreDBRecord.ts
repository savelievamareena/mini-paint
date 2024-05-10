import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase.ts";
import { toast } from "react-toastify";

interface DbRecordTypes {
    createdAt: number;
    userEmail: string | null;
    userId: string;
    url: string;
}

export default function createFirestoreDBRecord(
    tableName: string,
    id: string,
    record: DbRecordTypes,
): Promise<boolean> {
    return setDoc(doc(db, tableName, id), record)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.error(error);
            toast.error("Upload to the DB failed!");
            return false;
        });
}
