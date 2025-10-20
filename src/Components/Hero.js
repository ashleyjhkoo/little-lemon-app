import './Hero.css';
import heroImage from '../Assets/hero-img.png';
import { NavLink } from 'react-router-dom';

const Hero = (props) => {
    return (
        <section class={props.className}>
            <ul class="content-container_hero">
                <li class="hero-item" id="hero-title">Little Lemon</li>
                <li class="hero-item" id="hero-location">Chicago</li>
                <li class="hero-item" id="hero-description">We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</li>
                <button class="hero-item" id="hero-button"><NavLink to="/bookingpage?tab=reserve-a-table">Reserve a Table</NavLink></button>
                <li class="hero-image">
                    <img src={heroImage} alt="little lemon signature dish" />
                </li>
            </ul>
        </section>

    );
};

export default Hero;

