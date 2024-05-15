import { Suspense, lazy } from "react";
import { Loading } from "../components/Loading";
const Login = lazy(() => import("../modules/auth/Login"));

const LoginPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Login />
        </Suspense>
    );
};

export default LoginPage;
