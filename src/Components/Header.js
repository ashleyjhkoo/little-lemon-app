import './Header.css';
import littleLemonLogoForHeader from '../Assets/Little-Lemon-Logo-header.png';
// import React from "react";
import { Link, NavLink } from 'react-router-dom';

const Header = ({ className }) => {

    return (
        <header className={className}>
                <nav className="content-container_nav">
                    <Link to="/">
                        <img src={littleLemonLogoForHeader} alt="little lemon logo for header" />
                    </Link>
                    <ul className="nav-item-container">
                        <li className="nav-item"><NavLink to="/">Home</NavLink></li>
                        <li className="nav-item"><NavLink to="/about">About</NavLink></li>
                        <li className="nav-item"><NavLink to="/reservations">Reservations</NavLink></li>
                        <li className="nav-item">Order Online</li>
                        <li className="nav-item">Login</li>
                    </ul>
                </nav>
        </header> 
    );
};

export default Header; 
