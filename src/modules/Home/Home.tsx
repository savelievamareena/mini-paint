import { ChangeEvent, useEffect, useState } from "react";
import { collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";
import getPicsFromDb from "./helpers/getPicsFromDb";
import { useModalHandlers, usePictureDelete } from "../Home/hooks";
import { PictureCard } from "./components/PictureCard";
import handleDbErrors from "src/helpers/handleDbError";
import { cardElementsWrapper, cardsContainer, select, modal } from "./Home.styles";
import {
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Container,
    Box,
    Pagination,
} from "@mui/material";
import useCollectionRef from "./hooks/useCollectionRef";
import { db } from "firebase";
import { retrieveEmailsFromPicData } from "./helpers/retrieveEmailsFromPicData";

const Home = () => {
    const { currentUser } = useAuth();
    const numberOfItemsPerPage = 4;

    const [picturesData, setPicturesData] = useState<DocumentData[]>([]);
    const [usersEmails, setUsersEmails] = useState<string[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("-1");
    const [pagesNumber, setPagesNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const { handleModalOpen, handleModalClose, picToShow, modalOpen } = useModalHandlers();
    const getCollectionRef = useCollectionRef(numberOfItemsPerPage, currentPage, selectedEmail);
    const { handleDelete } = usePictureDelete(setPicturesData);

    useEffect(() => {
        (async () => {
            let baseQuery = query(collection(db, "pics"), orderBy("createdAt", "desc"));
            let snapshot;

            if (selectedEmail === "-1") {
                snapshot = await getDocs(baseQuery);
                const totalDocuments = snapshot.size;
                setPagesNumber(Math.ceil(totalDocuments / numberOfItemsPerPage));

                const allPicData = getPicsFromDb(snapshot);
                setUsersEmails(retrieveEmailsFromPicData(allPicData));
            } else {
                baseQuery = query(baseQuery, where("userEmail", "==", selectedEmail));
                snapshot = await getDocs(baseQuery);
                const totalDocuments = snapshot.size;
                setPagesNumber(Math.ceil(totalDocuments / numberOfItemsPerPage));
            }
        })();
    }, [selectedEmail, numberOfItemsPerPage]);

    useEffect(() => {
        (async () => {
            try {
                const collectionRef = await getCollectionRef();
                const snapshot = await getDocs(collectionRef);
                const data = getPicsFromDb(snapshot);
                setPicturesData(data);
            } catch (error: unknown) {
                handleDbErrors(error);
            }
        })();
    }, [currentPage, selectedEmail]);

    async function handleSelectChange(event: SelectChangeEvent<string>) {
        setCurrentPage(1);
        setSelectedEmail(event.target.value);
    }

    function handlePaginationChange(_event: ChangeEvent<unknown>, page: number) {
        setCurrentPage(page);
    }

    const pictureCardElements = picturesData.map(({ data, id }) => {
        return (
            <PictureCard
                key={id}
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
            <Select sx={select} value={selectedEmail} onChange={handleSelectChange}>
                <MenuItem value={"-1"}>All users</MenuItem>
                {usersEmails.map((userEmail, i) => {
                    return (
                        <MenuItem value={userEmail} key={i}>
                            {userEmail}
                        </MenuItem>
                    );
                })}
            </Select>
            <Box sx={cardElementsWrapper}>{pictureCardElements}</Box>
            <Pagination
                count={pagesNumber}
                page={currentPage}
                color='primary'
                onChange={handlePaginationChange}
                sx={{ marginBottom: "10px" }}
            />

            <Modal open={modalOpen} onClose={handleModalClose}>
                <Box component='img' sx={modal} alt={selectedEmail} src={picToShow} />
            </Modal>
        </Container>
    );
};

export default Home;
