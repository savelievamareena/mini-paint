import { useNavigate } from "react-router-dom";
import { Login } from "../modules/auth";

const LoginPage = () => {
    const navigate = useNavigate();
    return <Login navigate={navigate} />;
};

export default LoginPage;
