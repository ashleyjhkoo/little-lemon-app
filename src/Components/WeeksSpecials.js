import './WeeksSpecials.css';
import greekSalad from '../Assets/greek-salad.jpg';
import bruchetta from '../Assets/bruchetta.png';
import lemonDessert from '../Assets/lemon-dessert.jpg';
import deliveryIcon from '../Assets/delivery-icon.svg';

const WeeksSpecials = (props) => {
    return (
      <section class={props.className}>
        <section class="content-container_weeklySpecials">
            <h1 class="weeklySpecials-item" id="weeklySpecials-title">This week's specials!</h1>
            <button class="weeklySpecials-item" id="weeklySpecials-button">Online Menu</button>
            <ul class="weeklySpecials-item weeklySpecials-cards" id="weeklySpecials-card1">
                <img src={greekSalad} alt="greek salad" className="weeklySpecials-images" />
                <li class="weeklySpecials-texts cardTexts1">Greek Sald</li>
                <li class="weeklySpecials-texts cardTexts2">$8.0</li>
                <li class="weeklySpecials-texts cardTexts3">The famous greek salad of crispy letter, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.</li>
                <li class="weeklySpecials-texts cardTexts4" role="button">Order a delivery<img src={deliveryIcon} alt="order a delivery icon" class="weeklySpecials-icon" role="button" /></li>
            </ul>
            <ul className="weeklySpecials-item weeklySpecials-cards" id="weeklySpecials-card2">
                <img src={bruchetta} alt="bruchetta" class="weeklySpecials-images" />
                <li class="weeklySpecials-texts cardTexts1">Bruchetta</li>
                <li class="weeklySpecials-texts cardTexts2">$15.0</li>
                <li class="weeklySpecials-texts cardTexts3">Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.</li>
                <li class="weeklySpecials-texts cardTexts4" role="button">Order a delivery<img src={deliveryIcon} alt="order a delivery icon" class="weeklySpecials-icon" role="button" /></li>
            </ul>
            <ul class="weeklySpecials-item weeklySpecials-cards" id="weeklySpecials-card3">
                <img src={lemonDessert} alt="lemon dessert" class="weeklySpecials-images" />
                <li class="weeklySpecials-texts cardTexts1">Lemon Dessert</li>
                <li class="weeklySpecials-texts cardTexts2">$12.0</li>
                <li class="weeklySpecials-texts cardTexts3">This comes straight from grandma’s recipe book, every last ingredient has been sourced and is as authentic as can be imagined.</li>
                <li class="weeklySpecials-texts cardTexts4" role="button">Order a delivery<img src={deliveryIcon} alt="order a delivery icon" class="weeklySpecials-icon" role="button" /></li>
            </ul>
        </section>
      </section>
    );
};

export default WeeksSpecials;


