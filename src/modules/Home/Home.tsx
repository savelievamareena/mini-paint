import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "firebase.ts";
import { useAuth } from "../../context/AuthContext.tsx";
import getPicsFromDb from "./helpers/getPicsFromDb.ts";
import { IconButton, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Card, CardHeader, CardMedia, CardContent, Container, Box } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { retrieveEmailsFromPicData } from "./helpers/retrieveEmailsFromPicData.ts";
import { cardElementsWrapper, cardsContainer, select } from "./Home.styles.ts";

const Home = () => {
    const { currentUser } = useAuth();

    const [picturesData, setPicturesData] = useState<DocumentData[] | undefined>([]);
    const [usersEmails, setUsersEmails] = useState<string[]>([]);
    const [selectedEmailId, setSelectedEmailId] = useState("-1");

    useEffect(() => {
        (async () => {
            const collectionRef = collection(db, "pics");
            try {
                const snapshot = await getDocs(collectionRef);

                const docs = getPicsFromDb(snapshot);
                setPicturesData(docs);
                setUsersEmails(retrieveEmailsFromPicData(docs));
            } catch (error: unknown) {
                if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    toast.error("Error fetching documents");
                }
            }
        })();

        return () => setPicturesData([]);
    }, []);

    async function handleSelectChange(event: SelectChangeEvent<string>) {
        setSelectedEmailId(event.target.value);

        const collectionRef = collection(db, "pics");
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
            toast.error("Error fetching documents");
        }
    }

    async function handleDelete(id: string) {
        const docRef = doc(db, "pics", id);
        try {
            await deleteDoc(docRef);
            setPicturesData((prevState) => {
                if (prevState !== undefined) {
                    return prevState.filter((image) => image.id !== id);
                }
            });
        } catch {
            toast.error("Could not delete the image");
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
            <Card
                key={id}
                raised
                sx={{
                    width: 240,
                    margin: "0 auto",
                }}
            >
                <CardHeader
                    action={
                        <IconButton aria-label='settings'>
                            {data.userEmail === currentUser!.email ? (
                                <DeleteForeverOutlinedIcon onClick={() => handleDelete(id)} />
                            ) : (
                                <div style={{ width: "64px" }} />
                            )}
                        </IconButton>
                    }
                    title={"_"}
                />
                <CardMedia
                    component='img'
                    height='240'
                    width='240'
                    image={`https://firebasestorage.googleapis.com/v0/b/paint-43c73.appspot.com/o/${id}?alt=media`}
                />
                <CardContent>{data.userEmail}</CardContent>
            </Card>
        );
    });

    return (
        <Container sx={cardsContainer}>
            <Select sx={select} value={selectedEmailId} onChange={handleSelectChange}>
                <MenuItem value={"-1"}>All users</MenuItem>
                {menuItems}
            </Select>
            <Box sx={cardElementsWrapper}>{cardElements}</Box>
        </Container>
    );
};

export default Home;
