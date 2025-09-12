import './Testimonial.css';
import ratingStarFinal from '../Assets/rating-star-final.svg';
import profilePic1 from '../Assets/profile-pic1.png';
import profilePic2 from '../Assets/profile-pic2.png';
import profilePic3 from '../Assets/profile-pic3.png';
import profilePic4 from '../Assets/profile-pic4.png';

const Testimonial = (props) => {
    return (
        <section class={props.className}>
            <section class="content-container_testimonial">
                <h2 class="testimonial-items testimonial-title">Testimonial</h2>
                <section class="testimonial-items testimonial-cards">
                    <ul class="testimonial-card-group cardGroup-Samuel">
                        <img src={ratingStarFinal} alt="customer rating stars" class="testimonial-card-item cardItem-starRating" />
                        <img src={profilePic1} alt="customer profile 1" class="testimonial-card-item cardItem-profileImage" />
                        <li class="testimonial-card-item cardItem-customerName">Jackson Samuel</li>
                        <blockquote class="testimonial-card-item cardItem-customerComment">“My favorite restaurant in Chicago Old Town.”</blockquote>
                    </ul>
                    <ul class="testimonial-card-group cardGroup-Jacob">
                        <img src={ratingStarFinal} alt="customer rating stars" class="testimonial-card-item cardItem-starRating" />
                        <img src={profilePic2} alt="customer profile 2" class="testimonial-card-item cardItem-profileImage" />
                        <li class="testimonial-card-item cardItem-customerName">Rachel Jacob</li>
                        <blockquote class="testimonial-card-item cardItem-customerComment">“The Little Lemon&apos;s Mediterranean cuisine is top-notch in the Chicago region.”</blockquote>
                    </ul>
                    <ul class="testimonial-card-group cardGroup-Simpson">
                        <img src={ratingStarFinal} alt="customer rating stars" class="testimonial-card-item cardItem-starRating" />
                        <img src={profilePic3} alt="customer profile 3" class="testimonial-card-item cardItem-profileImage" />
                        <li class="testimonial-card-item cardItem-customerName">Tiffani Simpson</li>
                        <blockquote class="testimonial-card-item cardItem-customerComment">“The restaurant&apos;s atmosphere is so comforting and I enjoy often having a tea time with my lemon dessert.”</blockquote>
                    </ul>
                    <ul class="testimonial-card-group cardGroup-Meir">
                        <img src={ratingStarFinal} alt="customer rating stars" class="testimonial-card-item cardItem-starRating" />
                        <img src={profilePic4} alt="customer profile 4" class="testimonial-card-item cardItem-profileImage" />
                        <li class="testimonial-card-item cardItem-customerName">Sam Meir</li>
                        <blockquote class="testimonial-card-item cardItem-customerComment">“Their reservation system is fast and reliable.”</blockquote>
                    </ul>
                </section>
            </section>
        </section>
    );
};

export default Testimonial;

