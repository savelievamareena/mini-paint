import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

export type PictureCardProps = {
    data: DocumentData;
    id: string;
    currentUser: User | null;
    handleDelete: (id: string) => void;
    handleModalOpen: (id: string) => void;
};
