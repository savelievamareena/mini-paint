import { useEffect, useState } from "react";
import { collection, DocumentData, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "firebase.ts";
import { useAuth } from "../../context/AuthContext";
import getPicsFromDb from "./helpers/getPicsFromDb";
import { retrieveEmailsFromPicData } from "./helpers/retrieveEmailsFromPicData.ts";
import { useModalHandlers, usePictureDelete } from "../Home/hooks";
import { PictureCard } from "./components/PictureCard";
import handleDbErrors from "src/helpers/handleDbError.ts";
import { cardElementsWrapper, cardsContainer, select, modal } from "./Home.styles.ts";
import { MenuItem, Modal, Select, SelectChangeEvent, Container, Box } from "@mui/material";

const Home = () => {
    const { currentUser } = useAuth();

    const [picturesData, setPicturesData] = useState<DocumentData[] | undefined>([]);
    const [usersEmails, setUsersEmails] = useState<string[]>([]);
    const [selectedEmailId, setSelectedEmailId] = useState("-1");

    const { handleModalOpen, handleModalClose, picToShow, modalOpen } = useModalHandlers();
    const { handleDelete } = usePictureDelete(setPicturesData);

    useEffect(() => {
        (async () => {
            const collectionRef = query(collection(db, "pics"), orderBy("createdAt", "desc"));
            try {
                const snapshot = await getDocs(collectionRef);

                const docs = getPicsFromDb(snapshot);
                setPicturesData(docs);
                setUsersEmails(retrieveEmailsFromPicData(docs));
            } catch (error: unknown) {
                handleDbErrors(error);
            }
        })();

        return () => setPicturesData([]);
    }, []);

    async function handleSelectChange(event: SelectChangeEvent<string>) {
        setSelectedEmailId(event.target.value);

        const collectionRef = query(collection(db, "pics"), orderBy("createdAt", "desc"));
        let queryRef;

        if (event.target.value === "-1") {
            queryRef = collectionRef;
        } else {
            const email = event.target.value;
            queryRef = query(collectionRef, where("userEmail", "==", email));
        }
        try {
            const snapshot = await getDocs(queryRef);

            const docs = getPicsFromDb(snapshot);
            setPicturesData(docs);
        } catch (error: unknown) {
            handleDbErrors(error);
        }
    }

    const menuItems = usersEmails.map((userEmail, i) => {
        return (
            <MenuItem value={userEmail} key={i}>
                {userEmail}
            </MenuItem>
        );
    });

    const cardElements = picturesData!.map(({ data, id }) => {
        return (
            <PictureCard
                data={data}
                id={id}
                currentUser={currentUser}
                handleDelete={handleDelete}
                handleModalOpen={handleModalOpen}
            />
        );
    });

    return (
        <Container sx={cardsContainer}>
            <Select sx={select} value={selectedEmailId} onChange={handleSelectChange}>
                <MenuItem value={"-1"}>All users</MenuItem>
                {menuItems}
            </Select>
            <Box sx={cardElementsWrapper}>{cardElements}</Box>

            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box
                    component='img'
                    sx={modal}
                    alt={usersEmails[Number(selectedEmailId)]}
                    src={picToShow}
                />
            </Modal>
        </Container>
    );
};

export default Home;
