import './About.css';
import littleLemonChicagoPic from '../Assets/little-lemon-chicago-pic.png';

const About = (props) => {
    return (
      <section class={props.className}>
        <section class="content-container_about">
            <ul class="about-text-items">
                <li class="about-text-item textItem-title">Little Lemon</li>
                <li class="about-text-item textItem-location">Chicago</li>
                <li class="about-text-item textItem-description">Mario and Adrian are the fantastic combo chefs and owners of the Little Lemon, Chicago. Their dreams are to satisfy all Chicago people&apos;s expectations to long for the authentic tastes with traditional grandma&apos;s Mediterranean recipes, but also a modern fusion twist to bring the young generations&apos; trending tastes.<br /><br />
                Also, their dessert selections are prestigious throughout Chicago&apos;s Old Town and Lake View, bringing long-term clients. Why don&apos;t you come over tonight and see and taste? </li>
            </ul>
            <section class="about-image-item">
                <img src={littleLemonChicagoPic} alt="Little Lemon Chicago images" />
            </section>
        </section>
      </section>
    );
};

export default About;        

