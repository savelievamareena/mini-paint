import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, StyledEngineProvider, createTheme } from "@mui/material/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import App from "./App";

const theme = createTheme({
    // customize theme
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <StyledComponentsThemeProvider theme={theme}>
                    <App />
                </StyledComponentsThemeProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    </React.StrictMode>,
);
