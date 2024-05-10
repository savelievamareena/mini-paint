import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./modules/layout/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";
import Homepage from "./pages/Homepage.tsx";
import Login from "./pages/Login.tsx";
import Paint from "./pages/Paint.tsx";
import Signup from "./pages/Signup.tsx";
import AuthGuard from "./AuthGuard.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ROUTES } from "./constants/router.ts";
import "../index.css";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <Login />,
            },
            {
                path: ROUTES.SIGNUP,
                element: <Signup />,
            },
            {
                element: <AuthGuard />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <Homepage />,
                    },
                    {
                        path: ROUTES.PAINT,
                        element: <Paint />,
                    },
                ],
            },
        ],
    },
]);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </React.StrictMode>,
);
