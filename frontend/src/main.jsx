import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { getTokenWithExpiration } from './pages/Auth/Session';
import axios from "axios";
import appConfig from "./config/appConfig.js";

const token = getTokenWithExpiration("token");
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
axios.defaults.baseURL = appConfig.baseurlAPI;
axios.defaults.headers.common['Content-Type'] = 'application/json';


ReactDOM.createRoot(document.getElementById("app")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);
