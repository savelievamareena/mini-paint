import { Outlet } from "react-router-dom";
import { Header } from "src/modules/Header";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default Layout;
