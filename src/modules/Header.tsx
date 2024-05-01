import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import BrushIcon from "@mui/icons-material/Brush";
import Box from "@mui/material/Box";
import { Stack } from "@mui/material";
import { useAuth } from "../context/AuthContext.tsx";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
    const { currentUser } = useAuth();
    const auth = getAuth();
    const navigate = useNavigate();

    function handleLogout() {
        signOut(auth)
            .then(() => {
                navigate("/login");
            })
            .catch(() => {
                toast.error("Something went wrong", { position: "bottom-left" });
            });
    }

    const routeHome: string = currentUser ? "/" : "/login";
    const routePaint: string = currentUser ? "/canvas" : "/login";

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
            <ToastContainer />
            <Stack
                direction='row'
                spacing={2}
                component={"nav"}
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <NavLink to={routeHome}>
                    <HomeIcon sx={{ fontSize: 40 }} color='primary' />
                </NavLink>
                {currentUser && (
                    <>
                        <NavLink to={routePaint}>
                            <BrushIcon sx={{ fontSize: 40 }} color='primary' />
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
                    <Box onClick={handleLogout} sx={{ cursor: "pointer" }}>
                        <LogoutIcon sx={{ fontSize: 36 }} color='primary' />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Header;
