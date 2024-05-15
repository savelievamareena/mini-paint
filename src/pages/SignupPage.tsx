import { Suspense, lazy } from "react";
import { Loading } from "../components/Loading";
const Signup = lazy(() => import("../modules/auth/Signup"));

const SignupPage = () => {
    return (
        <Suspense fallback={<Loading />}>
            <Signup />
        </Suspense>
    );
};

export default SignupPage;
