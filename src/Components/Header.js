import './Header.css';
import littleLemonLogoForHeader from '../Assets/Little-Lemon-Logo-header.png';
import React from "react";

const Header = ({ className }) => {

    return (
        <header className={className}>
                <nav className="content-container_nav">
                    <img src={littleLemonLogoForHeader} alt="little lemon logo for header" />
                    <ul className="nav-item-container">
                        <li className="nav-item">Home</li>
                        <li className="nav-item">About</li>
                        <li className="nav-item">Reservations</li>
                        <li className="nav-item">Order Online</li>
                        <li className="nav-item">Login</li>
                    </ul>
                </nav>
        </header> 
    );
};

export default Header; 
