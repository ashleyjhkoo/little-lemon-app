import './Header.css';
import littleLemonLogoForHeader from '../Assets/Little-Lemon-Logo-header.png';
import React from "react";

const Header = ({ className, ...pageProps }) => {

    return (
        <header className={className}>
                <nav class="content-container_nav">
                    <img src={littleLemonLogoForHeader} alt="little lemon logo for header" />
                    <ul class="nav-item-container">
                        <li class="nav-item">Home</li>
                        <li class="nav-item">About</li>
                        <li class="nav-item">Reservations</li>
                        <li class="nav-item">Order Online</li>
                        <li class="nav-item">Login</li>
                    </ul>
                </nav>
        </header>
    );
};

export default Header; 
