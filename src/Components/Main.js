import './Main.css';
import Hero from './Hero';
import WeeksSpecials from './WeeksSpecials';
import Testimonial from './Testimonial';
import About from './About';
import { useScrollToSection } from '../Hooks/useScrollToSection';

const Main = (about) => {
    const heroClass = 'bg-container_hero';
    const weeklyClass = 'bg-container_weeklySpecials';
    const testimonialClass = 'bg-container_testimonial';
    const aboutClass = 'bg-container_about';

    const aboutRef = useScrollToSection('/about');

    return (
        <main>
          <Hero className={heroClass} />
          <WeeksSpecials className={weeklyClass} />
          <Testimonial className={testimonialClass} />
          <About ref={aboutRef} className={aboutClass} />
        </main>
    );
};

export default Main;
