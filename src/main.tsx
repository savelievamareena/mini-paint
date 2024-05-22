import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import ErrorPage from "./pages/ErrorPage";
const HomePage = lazy(() => import("src/pages/HomePage"));
const LoginPage = lazy(() => import("src/pages/LoginPage"));
const PaintPage = lazy(() => import("src/pages/PaintPage"));
const SignupPage = lazy(() => import("src/pages/SignupPage"));
import AuthGuard from "./AuthGuard";
import { AuthProvider } from "./context/AuthContext";
import { ROUTES } from "./constants";
import "../index.css";

const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            {
                path: ROUTES.LOGIN,
                element: <LoginPage />,
                errorElement: <ErrorPage />,
            },
            {
                path: ROUTES.SIGNUP,
                element: <SignupPage />,
                errorElement: <ErrorPage />,
            },
            {
                element: <AuthGuard />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <HomePage />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: ROUTES.PAINT,
                        element: <PaintPage />,
                        errorElement: <ErrorPage />,
                    },
                    {
                        path: ROUTES.EDIT,
                        element: <PaintPage />,
                        errorElement: <ErrorPage />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFoundPage />,
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
