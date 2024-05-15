import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "src/modules/Header";
import { Loading } from "../Loading";

const Layout = () => {
    return (
        <>
            <Header />
            <Suspense fallback={<Loading />}>
                <Outlet />
            </Suspense>
        </>
    );
};

export default Layout;
