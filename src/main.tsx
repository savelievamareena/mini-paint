import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import PaintPage from "./pages/PaintPage.tsx";
import SignupPage from "./pages/SignupPage.tsx";
import AuthGuard from "./AuthGuard.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ROUTES } from "./constants/router.ts";
import "../index.css";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFoundPage />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
            },
            {
                path: ROUTES.SIGNUP,
                element: <SignupPage />,
            },
            {
                element: <AuthGuard />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <HomePage />,
                    },
                    {
                        path: ROUTES.PAINT,
                        element: <PaintPage />,
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
