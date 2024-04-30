import React from "react";
import ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./modules/Layout.tsx";
import NotFound from "./pages/NotFound.tsx";
import Homepage from "./pages/Homepage.tsx";
import Login from "./pages/Login.tsx";
import Canvas from "./pages/Canvas.tsx";
import Signup from "./pages/Signup.tsx";
import ProtectedRoutes from "./ProtectedRoutes.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "../index.css";

const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <NotFound />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/signup",
                element: <Signup />,
            },
            {
                element: <ProtectedRoutes />,
                children: [
                    {
                        path: "/",
                        element: <Homepage />,
                    },
                    {
                        path: "/canvas",
                        element: <Canvas />,
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
        <StyledEngineProvider injectFirst>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </StyledEngineProvider>
    </React.StrictMode>,
);
