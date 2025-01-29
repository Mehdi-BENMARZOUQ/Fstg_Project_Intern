import axios from "axios";
import NavLink from "./NavLink";
import React, { useState, useEffect, useRef, Children } from "react";
import {Link, useNavigate} from "react-router-dom";
import fstg_logo from "../assets/Fstg_Logo.png";
import '../assets/stisla/css/custom.css';
import { getTokenWithExpiration } from "../pages/Auth/Session";
import appConfig from "../config/appConfig";

export default function Navigation() {
    const [user, setUser] = useState({});
    const navigate = useNavigate();
    const token = getTokenWithExpiration("token");
    const [conventionCreated, setConventionCreated] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDropdownClick = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const handleClickOutsideDropdown = (event) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target)
        ) {
            setDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.title = "Dashboard";
        if (!token) {
            navigate("/");
        }
        fetchData();

        document.addEventListener("mousedown", handleClickOutsideDropdown);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutsideDropdown
            );
        };
    }, [navigate]);

    const fetchData = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.get(`${appConfig.baseurlAPI}/user`).then((response) => {
            setUser(response.data);
            console.log(response.data);
        });
    };



    const logoutHandler = async () => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await axios.post(`${appConfig.baseurlAPI}/logout`).then(() => {
            localStorage.removeItem("token");
            navigate("/");
        });
    };


    useEffect(() => {
        const checkConvention = async () => {
            const token = getTokenWithExpiration("token");
            if (!token) {
                console.log('No token found. Please login again.');
                navigate('/');
                return;
            }

            try {

                const response = await axios.get(`${appConfig.baseurlAPI}/conventionstage/user/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data.exists) {
                    setConventionCreated(true);
                } else {
                    setConventionCreated(false);
                }
            } catch (error) {
                if (error.response) {
                    console.error("Error Response Data:", error.response.data);
                    console.error("Error Status:", error.response.status);
                    console.error("Error Headers:", error.response.headers);
                } else if (error.request) {
                    console.error("No Response Received:", error.request);
                } else {
                    console.error("Request Setup Error:", error.message);
                }
            }
        };

        if (user.id) {
            checkConvention();
        }
    }, [user.id, navigate]);



    return (
        <>
            <nav className="navbar navbar-expand-lg main-navbar">
                <Link to="/" className="navbar-brand sidebar-gone-hide" style={{width: "120px",height: '65px'}}>
                    <img src={fstg_logo} alt="FSTG Logo" style={{width: "100%",height: '100%'}}/>
                </Link>
                <div className="navbar-nav">
                    <a
                        href="#"
                        className="nav-link sidebar-gone-show"
                        data-toggle="sidebar"
                    >
                        <i className="fas fa-bars"></i>
                    </a>
                </div>
                <form className="form-inline ml-auto"></form>
                <ul className="navbar-nav navbar-right">
                    <li className="dropdown">
                        <a
                            href="#"
                            data-toggle="dropdown"
                            className="nav-link dropdown-toggle nav-link-lg nav-link-user"
                        >
                            <div className="d-sm-none d-lg-inline-block">
                                Hi, {user.name}
                            </div>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">

                            <div className="dropdown-title">
                                ROLE: {user.role}
                            </div>
                            <Link
                                to="/profile"
                                className="dropdown-item has-icon"
                            >
                                <i className="far fa-user"></i> Profile
                            </Link>
                            <div className="dropdown-divider"></div>
                            <a
                                onClick={logoutHandler}
                                href="#"
                                className="dropdown-item has-icon text-danger"
                            >
                                <i className="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>
            <nav className="navbar navbar-secondary navbar-expand-lg">
                <div className="container">
                    <ul className="navbar-nav">
                        <li
                            className={`nav-item ${
                                location.pathname === "/dashboard"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            <NavLink href="/dashboard">
                                <i className="far fa-home"></i>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        <li
                            className={`nav-item dropdown ${
                                location.pathname === "/general-feature" ||
                                location.pathname === "/advanced-feature" ||
                                location.pathname === "/products" ||
                                location.pathname === "/gallery" ||
                                location.pathname === "/multiple-insert"
                                    ? "active"
                                    : ""
                            }`}
                            ref={dropdownRef}
                        >
                            <a
                                href="#"
                                onClick={handleDropdownClick}
                                className={`nav-link has-dropdown ${
                                    dropdownOpen ? "show" : ""
                                }`}
                            >
                                <i className="fas fa-briefcase"></i>
                                <span>Stage</span>
                            </a>
                            <ul
                                className={`dropdown-menu ${
                                    dropdownOpen ? "show" : ""
                                }`}
                            >
                                {user.role === "Student" && (
                                    <>
                                        <li className={`nav-item ${location.pathname === "/convention_stage" ? "active" : ""}`}>
                                            <NavLink href="/convention_stage" customStyle={{ color: conventionCreated ? 'green' : '', background: conventionCreated ? 'lightgreen' : '' }}>
                                                CONVENTION DE STAGE
                                            </NavLink>
                                        </li>
                                        <li className={`nav-item ${location.pathname === "/telecharger_convention" ? "active" : ""}`}>
                                            <NavLink href="/telecharger_convention">
                                                TELECHARGER VOTRE CONVENTION
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                                {user.role === "Communication" && (
                                    <li className={`nav-item ${location.pathname === "/confirmer_convention_communication" ? "active" : ""}`}>
                                        <NavLink href="/confirmer_convention_communication">
                                            CONFIRMER LES CONVENTION
                                        </NavLink>
                                    </li>
                                )}
                                {user.role === "SGeneral" && (
                                    <li className={`nav-item ${location.pathname === "/confirmer_convention_sg" ? "active" : ""}`}>
                                        <NavLink href="/confirmer_convention_sg">
                                            CONFIRMER LES CONVENTION
                                        </NavLink>
                                    </li>
                                )}

                            </ul>
                        </li>


                       
                    </ul>
                </div>
            </nav>


        </>
    );
}
