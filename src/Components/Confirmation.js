import React from 'react';
import { useParams } from 'react-router-dom';
import './Confirmation.css';
import congratulationImage from '../Assets/Congratulation.png';
import seeYouNextTimeImage from '../Assets/SeeYouNextTime.png';
import { NavLink, Link } from 'react-router-dom';


const Confirmation = () => {
    // For styling
    const confirmationBgClasss = 'bg-container_confirmationPage';
    const confirmationContentClass = 'content-container_confirmationPage';

    // Extract the 'type' parameter from the URL
    const { type } = useParams();

    const renderContent = () => {
        switch (type) {
            case 'reservation':
                return (
                    <ul>
                        <li className="listImage"><img src={congratulationImage} alt="congratulation reservation" /></li>
                        <li className="listTitle"><h1>Congratulation!</h1></li>
                        <li className="listDescription"><p>You successfully reserved your table. Your confirmation number is below:</p></li>
                        <li className="listNumber"><p>#123J782015</p></li>
                        <li className="listButtons">
                            <button className="listButton viewMyReservationButton"><Link to="/bookingpage?tab=view-my-reservation">View my reservation</Link></button>
                            <button className="listButton homeButton"><NavLink to="/">Home</NavLink></button>
                        </li>
                    </ul>
                );
            case 'update':
                return (
                    <ul>
                        <li className="listImage"><img src={congratulationImage} alt="congratulation update" /></li>
                        <li className="listTitle"><h1>Congratulation!</h1></li>
                        <li className="listDescription"><p>You successfully updated your reservation on this confirmation number:</p></li>
                        <li className="listNumber"><p>#123J782015</p></li>
                        <li className="listButtons">
                            <button className="listButton viewMyReservationButton"><Link to="/bookingpage?tab=view-my-reservation">View my reservation</Link></button>
                            <button className="listButton homeButton"><NavLink to="/">Home</NavLink></button>
                        </li>
                    </ul>
                );
            case 'goodbye':
                return (
                    <ul>
                        <li className="listImage"><img src={seeYouNextTimeImage} alt="see you next time" /></li>
                        <li className="listTitle"><h1>See you next time!</h1></li>
                        <li className="listDescription"><p>You canceled this reservation on this confirmation number:</p></li>
                        <li className="listNumber"><p>#123J782015</p></li>
                        <li className="listButtons">
                            <button className="listButton reserveATableButton">Reserve a table</button>
                            <button className="listButton homeButton"><NavLink to="/">Home</NavLink></button>
                        </li>
                    </ul>
                );
            default:
                return (
                    <ul>
                        <li className="listImage"><img src={congratulationImage} alt="congratulation reservation" /></li>
                        <li className="listTitle"><h1>Congratulation!</h1></li>
                        <li className="listDescription"><p>You successfully reserved your table. Your confirmation number is below:</p></li>
                        <li className="listNumber"><p>#123J782015</p></li>
                        <li className="listButtons">
                            <button className="listButton viewMyReservationButton"><Link to="/bookingpage?tab=view-my-reservation">View my reservation</Link></button>
                            <button className="listButton homeButton"><NavLink to="/">Home</NavLink></button>
                        </li>
                    </ul>
                );
        }
    }

    return (
        <main className={confirmationBgClasss}>
            <section className={confirmationContentClass}>
                {renderContent()}
            </section>
        </main>
    );
};

export default Confirmation;