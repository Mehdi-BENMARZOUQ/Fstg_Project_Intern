import React from "react";
import { Link } from "react-router-dom";

export default function NavLink({ href, children,customStyle }) {
    return (
        <Link className="nav-link" to={href} style={customStyle}>
            {children}
        </Link>
    );
}
