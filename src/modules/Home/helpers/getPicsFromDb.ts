import { QuerySnapshot } from "firebase/firestore";

export default function getPicsFromDb(snapshot: QuerySnapshot) {
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as DbRecordType,
    }));
}
