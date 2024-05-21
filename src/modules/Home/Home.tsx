import { ChangeEvent, useEffect, useState } from "react";
import { collection, DocumentData, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebase";
import { useAuth } from "src/context/AuthContext";
import getPicsFromDb from "./helpers/getPicsFromDb";
import {
    useModalHandlers,
    usePictureDelete,
    useCollectionRef,
    useDeleteConfirmationDialog,
} from "../Home/hooks";
import { PictureCard } from "./components/PictureCard";
import handleDbErrors from "src/helpers/handleDbError";
import { retrieveEmailsFromPicData } from "./helpers/retrieveEmailsFromPicData";
import { cardElementsWrapper, cardsContainer, select, modal } from "./Home.styles";
import { ConfirmationDialog } from "../../components/ConfirmationDialog";
import {
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    Container,
    Box,
    Pagination,
    Button,
} from "@mui/material";

const Home = () => {
    const { currentUser } = useAuth();
    const numberOfItemsPerPage = 4;

    const [picturesData, setPicturesData] = useState<DocumentData[]>([]);
    const [usersEmails, setUsersEmails] = useState<string[]>([]);
    const [selectedEmail, setSelectedEmail] = useState("-1");
    const [pagesNumber, setPagesNumber] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [deletedCount, setDeletedCount] = useState(0);

    const { handleModalOpen, handleModalClose, picToShow, modalOpen } = useModalHandlers();
    const getCollectionRef = useCollectionRef(numberOfItemsPerPage, currentPage, selectedEmail);

    const incrementDeletedCount = () => setDeletedCount((prev) => prev + 1);
    const { handleDelete } = usePictureDelete(setPicturesData, incrementDeletedCount);

    const { dialogOpen, handleDialogOpen, handleDialogClose, handlePictureDelete } =
        useDeleteConfirmationDialog(handleDelete);

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
    }, [selectedEmail, numberOfItemsPerPage, deletedCount]);

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
    }, [currentPage, selectedEmail, deletedCount]);

    async function handleSelectChange(event: SelectChangeEvent) {
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
                handleDelete={() => {
                    handleDialogOpen(id);
                }}
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

            <ConfirmationDialog
                handleClose={handleDialogClose}
                open={dialogOpen}
                title={"Are you sure you want to delete the picture?"}
            >
                <Button
                    variant='contained'
                    onClick={handlePictureDelete}
                    sx={{ marginRight: "20px" }}
                >
                    YES
                </Button>
                <Button variant='outlined' onClick={handleDialogClose}>
                    NO
                </Button>
            </ConfirmationDialog>
        </Container>
    );
};

export default Home;
