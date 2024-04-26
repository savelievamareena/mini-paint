import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import BrushIcon from "@mui/icons-material/Brush";
import { Link } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
    const { currentUser } = useAuth();
    const auth = getAuth();
    const navigate = useNavigate();

    function handleLogout() {
        signOut(auth)
            .then(() => {
                //  toast
                navigate("/login");
            })
            .catch((error: unknown) => {
                console.log(error);
                //  toast
            });
    }

    const routeHome: string = currentUser ? "/" : "/login";
    const routePaint: string = currentUser ? "/canvas" : "/login";

    return (
        <div className='header_wrapper'>
            <div className='header_left'>
                <Link to={routeHome} underline='none' component={RouterLink}>
                    <HomeIcon sx={{ fontSize: 40 }} color='primary' />
                </Link>
                {currentUser && (
                    <Link to={routePaint} underline='none' component={RouterLink}>
                        <BrushIcon sx={{ fontSize: 40 }} color='primary' />
                    </Link>
                )}
            </div>
            <div className='header_right'>
                <div>{currentUser && <span>{currentUser.email}</span>}</div>
                <div>
                    {currentUser && (
                        <span onClick={handleLogout}>
                            <LogoutIcon sx={{ fontSize: 36 }} color='primary' />
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
