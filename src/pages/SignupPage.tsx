import { useNavigate } from "react-router-dom";
import { Signup } from "../modules/auth";

const SignupPage = () => {
    const navigate = useNavigate();
    return <Signup navigate={navigate} />;
};

export default SignupPage;
