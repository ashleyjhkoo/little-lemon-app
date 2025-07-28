import Nav from './Nav';
import './Header.css';
import littleLemonLogoForHeader from './Assets/Little-Lemon-Logo-header.png';

const Header = () => {
    return (
        <header>
            <img src={littleLemonLogoForHeader} alt="little lemon logo for header" />
            <Nav />
        </header>
    );
};

export default Header; 
