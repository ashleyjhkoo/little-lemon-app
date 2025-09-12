import './Main.css';
import Hero from './Hero';
import WeeksSpecials from './WeeksSpecials';
import Testimonial from './Testimonial';
import About from './About';

const Main = () => {
    const heroClass = 'bg-container_hero';
    const weeklyClass = 'bg-container_weeklySpecials';
    const testimonialClass = 'bg-container_testimonial';
    const aboutClass = 'bg-container_about';
    return (
        <main>
          <Hero className={heroClass} />
          <WeeksSpecials className={weeklyClass} />
          <Testimonial className={testimonialClass} />
          <About className={aboutClass} />
        </main>
    );
};

export default Main;
