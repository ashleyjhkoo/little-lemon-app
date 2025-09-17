import './Footer.css';
import footerLogo from '../Assets/little-lemon-logo-invert.svg';

const Footer = ({ className }) => {
    return (
        <footer className={className}>
                <section class="content-container_footer">
                    <section class="footer-logo-item"><img src={footerLogo} alt="Little Lemon logo inverted" /></section>
                    <ul class="footer-menu-groups">
                        <nav class="footer-menu-group menuGroup-nanvigation">
                            <h2>Navigation</h2>
                            <ul>
                                <li>Home</li>
                                <li>About</li>
                                <li>Menu</li>
                                <li>Reservations</li>
                                <li>Order online</li>
                                <li>Login</li>
                            </ul>
                        </nav>
                        <nav class="footer-menu-group menuGroup-contact">
                            <h2>Contact</h2>
                            <ul>
                                <li id="contactList-1">1443 Norton ave.<br />
                                    Chicago, WA 67052</li>
                                <li id="contactList-2">125-342-6738</li>
                                <li id="contactList-3">contact@littlelemon.com</li>
                            </ul>
                        </nav>
                        <nav class="footer-menu-group menuGroup-social-media">
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
