import { QuerySnapshot } from "firebase/firestore";
import { DbRecordType } from "../Home.types";

export default function getPicsFromDb(snapshot: QuerySnapshot) {
    const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as DbRecordType,
    }));

    if (!data) {
        return [];
    } else {
        return data;
    }
}
