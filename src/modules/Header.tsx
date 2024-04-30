import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import BrushIcon from "@mui/icons-material/Brush";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { getAuth, signOut } from "firebase/auth";
import "./styles/modules.css";

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
        <header className='header_wrapper'>
            <nav className='header_left'>
                <NavLink to={routeHome}>
                    <HomeIcon sx={{ fontSize: 40 }} color='primary' />
                </NavLink>
                {currentUser && (
                    <NavLink to={routePaint}>
                        <BrushIcon sx={{ fontSize: 40 }} color='primary' />
                    </NavLink>
                )}
            </nav>
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
        </header>
    );
};

export default Header;
