import { Container, Dialog, DialogTitle } from "@mui/material";
import React from "react";

type DialogProps = {
    handleClose: () => void;
    open: boolean;
    title: string;
    children: React.ReactNode;
};

const ConfirmationDialog = ({ handleClose, open, title, children }: DialogProps) => {
    return (
        <Dialog onClose={handleClose} open={open} sx={{ padding: "20px" }}>
            <DialogTitle>{title}</DialogTitle>
            <Container sx={{ textAlign: "center", padding: "30px" }}>{children}</Container>
        </Dialog>
    );
};

export default ConfirmationDialog;
