import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const AuthGuard = () => {
    const { currentUser } = useAuth();
    return currentUser ? <Outlet /> : <Navigate to='/login' replace />;
};

export default AuthGuard;
