import { collection, getDocs, limit, orderBy, query, startAfter, where } from "firebase/firestore";
import { db } from "firebase";
import { useCallback } from "react";

const useCollectionRef = (
    numberOfItemsPerPage: number,
    currentPage: number,
    selectedEmail: string | undefined,
) => {
    return useCallback(async () => {
        const offset = (currentPage - 1) * numberOfItemsPerPage;
        let baseQuery = query(collection(db, "pics"), orderBy("createdAt", "desc"));

        if (selectedEmail && selectedEmail !== "-1") {
            baseQuery = query(baseQuery, where("userEmail", "==", selectedEmail));
        }

        let paginatedQuery = query(baseQuery, limit(numberOfItemsPerPage));

        if (offset > 0) {
            const lastDocSnapshot = await getDocs(query(baseQuery, limit(offset)));
            const lastVisible = lastDocSnapshot.docs[lastDocSnapshot.docs.length - 1];
            paginatedQuery = query(baseQuery, startAfter(lastVisible), limit(numberOfItemsPerPage));
        }

        return paginatedQuery;
    }, [numberOfItemsPerPage, currentPage, selectedEmail]);
};

export default useCollectionRef;
