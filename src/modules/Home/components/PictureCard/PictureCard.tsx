import { Box, Card, CardContent, CardHeader, CardMedia, IconButton } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { type PictureCardProps } from "./PictureCard.types";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "src/constants";

const PictureCard = ({
    data,
    id,
    currentUser,
    handleDelete,
    handleModalOpen,
}: PictureCardProps) => {
    const pictureBasePath = import.meta.env.VITE_PICTURE_PATH;
    const navigate = useNavigate();

    function handleUpdate(id: string) {
        const editRoute = ROUTES.EDIT.replace(":id", id);
        navigate(editRoute);
    }

    return (
        <Card
            key={id}
            raised
            sx={{
                width: 240,
                margin: "0",
            }}
        >
            <CardHeader
                action={
                    <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                        width='100%'
                    >
                        {currentUser && data.userEmail === currentUser.email ? (
                            <>
                                <Box>
                                    <IconButton aria-label='edit' onClick={() => handleUpdate(id)}>
                                        <BorderColorIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <IconButton
                                        aria-label='delete'
                                        onClick={() => handleDelete(id)}
                                    >
                                        <DeleteForeverOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </>
                        ) : (
                            <div
                                style={{
                                    minHeight: "40px",
                                }}
                            />
                        )}
                    </Box>
                }
            />
            <CardMedia
                component='img'
                height='240'
                width='240'
                image={`${pictureBasePath}${id}?alt=media`}
                onClick={() => {
                    handleModalOpen(id);
                }}
            />
            <CardContent>{data.userEmail}</CardContent>
        </Card>
    );
};

export default PictureCard;
