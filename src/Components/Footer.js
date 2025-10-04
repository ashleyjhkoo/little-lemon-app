import './Footer.css';
import footerLogo from '../Assets/little-lemon-logo-invert.svg';
import { Link, NavLink } from 'react-router-dom';

const Footer = ({ className }) => {
    return (
        <footer className={className}>
                <section className="content-container_footer">
                    <section className="footer-logo-item">
                        <Link to="/">
                            <img src={footerLogo} alt="Little Lemon logo inverted" />
                        </Link>
                    </section>
                    <ul className="footer-menu-groups">
                        <nav className="footer-menu-group menuGroup-nanvigation">
                            <h2>Navigation</h2>
                            <ul>
                                <li><NavLink to="/">Home</NavLink></li>
                                <li><NavLink to="/about">About</NavLink></li>
                                <li>Menu</li>
                                <li><NavLink to="/bookingpage">Reservations</NavLink></li>
                                <li>Order online</li>
                                <li>Login</li>
                            </ul>
                        </nav>
                        <nav className="footer-menu-group menuGroup-contact">
                            <h2>Contact</h2>
                            <ul>
                                <li id="contactList-1">1443 Norton ave.<br />
                                    Chicago, WA 67052</li>
                                <li id="contactList-2">125-342-6738</li>
                                <li id="contactList-3">contact@littlelemon.com</li>
                            </ul>
                        </nav>
                        <nav className="footer-menu-group menuGroup-social-media">
                            <h2>Social Media</h2>
                            <ul>
                                <li id="socialMediaList-1">Facebook</li>
                                <li id="socialMediaList-2">YouTube</li>
                                <li id="socialMediaList-3">Instagram</li>
                                <li id="socialMediaList-4">LinkedIn</li>
                            </ul>
                        </nav>
                    </ul>
                </section>
        </footer>
    );
};

export default Footer; 
