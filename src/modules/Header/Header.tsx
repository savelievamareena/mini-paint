import { NavLink } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useAuth } from "src/context/AuthContext";
import { ROUTES } from "src/constants";
import { ConfirmationDialog } from "src/components/ConfirmationDialog";
import useLogOutConfirmationDialog from "./hooks/useLogOutConfirmationDialog.ts";
import { Home, Brush, Logout } from "@mui/icons-material";
import { Stack, Box, Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
    const { currentUser } = useAuth();

    const { dialogOpen, handleDialogOpen, handleDialogClose, handleLogout } =
        useLogOutConfirmationDialog();

    return (
        <Box
            component='header'
            sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 300px",
                minHeight: "60px",
                backgroundColor: "rgba(195, 192, 192, 0.76)",
            }}
        >
            <ToastContainer position='bottom-left' autoClose={3000} />
            <Stack
                direction='row'
                spacing={2}
                component={"nav"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <NavLink to={ROUTES.HOME}>
                    <Home sx={{ fontSize: 40 }} color='primary' />
                </NavLink>
                {currentUser && (
                    <>
                        <NavLink to={ROUTES.PAINT}>
                            <Brush sx={{ fontSize: 40 }} color='primary' />
                        </NavLink>
                        <Box>{currentUser && <span>{currentUser.email}</span>}</Box>
                    </>
                )}
            </Stack>
            <Box
                component='nav'
                sx={{ display: "flex", justifyContent: "flex-end", flexGrow: "1" }}
            >
                {currentUser && (
                    <Box onClick={handleDialogOpen} sx={{ cursor: "pointer" }}>
                        <Logout sx={{ fontSize: 36 }} color='primary' />
                    </Box>
                )}
            </Box>

            <ConfirmationDialog
                handleClose={handleDialogClose}
                open={dialogOpen}
                title={"Are you sure you want to log out?"}
            >
                <Button variant='contained' onClick={handleLogout} sx={{ marginRight: "20px" }}>
                    YES
                </Button>
                <Button variant='outlined' onClick={handleDialogClose}>
                    NO
                </Button>
            </ConfirmationDialog>
        </Box>
    );
};

export default Header;
