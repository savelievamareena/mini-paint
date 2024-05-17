import { Card, CardContent, CardHeader, CardMedia, IconButton } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import { type PictureCardProps } from "./PictureCard.types";

const PictureCard = ({
    data,
    id,
    currentUser,
    handleDelete,
    handleModalOpen,
}: PictureCardProps) => {
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
                    <IconButton aria-label='settings' onClick={() => handleDelete(id)}>
                        {data.userEmail === currentUser!.email ? (
                            <DeleteForeverOutlinedIcon />
                        ) : (
                            <div />
                        )}
                    </IconButton>
                }
                title={""}
                sx={{ maxHeight: "14px" }}
            />
            <CardMedia
                component='img'
                height='240'
                width='240'
                image={`https://firebasestorage.googleapis.com/v0/b/paint-43c73.appspot.com/o/${id}?alt=media`}
                onClick={() => {
                    handleModalOpen(id);
                }}
            />
            <CardContent>{data.userEmail}</CardContent>
        </Card>
    );
};

export default PictureCard;
