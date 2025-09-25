import React, { useState, useId } from 'react';
import './BookingForm.css';

const BookingForm = ({ className }) => {
    const bookingFormId = useId();
    const [formData, setFormData] = useState({
        occasion: '',
        resDate: '',
        resTime: '17:00',
        guests: 1,
        firstName: '',
        lastName: '',
        contactMethod: 'phone',
        phoneNumber: '',
        emailAddress: '',
        comments: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        //Add form submission logic here
        console.log('Form data submitted:', formData);
    };

    return (
        <>
            <form className={className} onSubmit={handleSubmit}>
                <fieldset className="fieldsets fieldset-reservationDetails">
                    <legend className="legends legend-reservationDetails">Reservation details</legend>
                    <ul className="uls ul-reservationDetails">
                        <li className="lis li-occasion">
                            <label htmlFor={bookingFormId + '-occasion'}>Occasion</label>
                            <select id={bookingFormId + '-occasion'}
                                    name="occasion"
                                    value={formData.occasion}
                                    onChange={handleChange}
                                    aria-describedby={bookingFormId + '-occasion-desc'}
                            >
                                <option>Birthday</option>
                                <option>Anniversary</option>
                            </select>
                            <span id={bookingFormId + '-occasion-desc'} 
                                  className="assistiveTexts">(Required) Choose occasion type
                            </span>
                        </li>
                        <li className="lis li-reservationDate">
                            <label htmlFor={bookingFormId + '-res-date'}>Reservation date</label>
                            <input type="date" 
                                   id={bookingFormId + '-res-date'} 
                                   name="resDate"
                                   value={formData.resDate}
                                   onChange={handleChange}
                                   aria-describedby={bookingFormId + '-res-date-desc'}
                                   required 
                            />
                            <span id={bookingFormId + '-res-date-desc'} 
                                  className="assistiveTexts">(Required) Choose reservation date
                            </span>
                        </li>
                        <li className="lis li-reservationTime">
                            <label htmlFor={bookingFormId + '-res-time'}>Reservation time</label>
                            <select id={bookingFormId + '-res-time'}
                                    name="resTime"
                                    value={formData.resTime}
                                    onChange={handleChange}
                                    aria-describedby={bookingFormId + '-res-time-desc'}
                            >
                                <option>17:00</option>
                                <option>18:00</option>
                                <option>19:00</option>
                                <option>20:00</option>
                                <option>21:00</option>
                                <option>22:00</option>             
                            </select>
                            <span id={bookingFormId + '-res-time-desc'} 
                                  className="assistiveTexts">(Required) Choose reservation time
                            </span>
                        </li>
                        <li className="lis li-numberOfGuests">
                            <label htmlFor={bookingFormId + '-guests'}>Number of guests</label>
                            <select 
                                type="number" 
                                placeholder={1} 
                                id={bookingFormId + '-guests'} 
                                name="guests"
                                value={formData.guests}
                                onChange={handleChange}
                                aria-describedby={bookingFormId + '-guests-desc'} 
                                required
                            >
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>   
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>   
                            </select>
                            <span id={bookingFormId + '-guests-desc'} 
                                  className="assistiveTexts">(Required) Choose number of guests 
                            </span>
                        </li>
                    </ul>
                </fieldset>

                <fieldset className="fieldsets fieldset-customerInformation">
                    <legend className="legends legend-customerInformation">Customer information</legend>
                    <ul className="uls ul-customerInformation">
                        <li className="lis li-customerFirstName">
                            <label htmlFor={bookingFormId + '-first-name'}>Customer first name</label>
                            <input type="text" 
                                   placeholder={'For example, Richard'} 
                                   id={bookingFormId + '-first-name'} 
                                   name="firstName"
                                   value={formData.firstName}
                                   onChange={handleChange}
                                   aria-describedby={bookingFormId + '-first-name-desc'}
                                   required 
                            />
                            <span id={bookingFormId + '-first-name-desc'} 
                                  className="assistiveTexts">(Required) Enter customer first name
                            </span>
                        </li>
                        <li className="lis li-customerLastName">
                            <label htmlFor={bookingFormId + '-last-name'}>Customer last name</label>
                            <input type="text" 
                                   placeholder={'For example, Kim'} 
                                   id={bookingFormId + '-last-name'} 
                                   name="lastName"
                                   value={formData.lastName}
                                   onChange={handleChange} 
                                   aria-describedby={bookingFormId + '-last-name-desc'}
                                   required 
                            />
                            <span id={bookingFormId + '-last-name-desc'} 
                                  className="assistiveTexts">(Required) Enter customer last name
                            </span>
                        </li>
                    </ul>
                    <fieldset className="fieldsets fieldset-contactMethod">
                        <legend className="legends legend-contactMethod">Contact method</legend>
                        <ul className="uls ul-contactMethod" 
                            role="radiogroup" 
                            aria-describedby={bookingFormId + '-contact-method-desc'}
                        >
                            <li className="lis li-contactMethodPhone">
                                <input 
                                    type="radio" 
                                    id={bookingFormId + '-contact-phone'}
                                    name="contactMethod" 
                                    value="phone"
                                    checked={formData.contactMethod === 'phone'}
                                    onChange={handleChange}
                                />
                                <label id="label-contactMethodPhone" 
                                       htmlFor={bookingFormId + '-contact-phone'}>Phone
                                </label>
                            </li>
                            <li className="lis li-contactMethodEmail">
                                <input 
                                    type="radio" 
                                    id={bookingFormId + '-contact-email'} 
                                    name="contactMethod" 
                                    value="email" 
                                    checked={formData.contactMethod === 'email'}
                                    onChange={handleChange} 
                                />
                                <label id="label-contactMethodEmail" 
                                       htmlFor={bookingFormId + '-contact-email'}>Email</label>
                            </li>
                        </ul>
                        <span id={bookingFormId + '-contact-method-desc'} 
                              className="assistiveTexts">(Required) Choose contact method
                        </span>
                    </fieldset>
                    <ul className="uls ul-contactInformation&Comments">
                        <li className="lis li-contactInformationPhone">
                            <label htmlFor={bookingFormId + '-phone-number'}>Phone</label>
                            <input type="tel" 
                                   id={bookingFormId + '-phone-number'} 
                                   name="phoneNumber" 
                                   value={formData.phoneNumber}
                                   placeholder={'For example, 123-456-7890'} 
                                   onChange={handleChange} 
                                   aria-describedby={bookingFormId + '-phone-number-desc'} 
                                   required={formData.contactMethod === 'phone'}
                            />
                            <span id={bookingFormId + '-phone-number-desc'} 
                                  className="assistiveTexts">(Required) Enter customer phone
                            </span>
                        </li>
                        <li className="lis li-contactInformationEmail">
                            <label htmlFor={bookingFormId + '-email-address'}>Email</label>
                            <input type="email" 
                                   id={bookingFormId + '-email-address'} 
                                   name="emailAddress" 
                                   value={formData.emailAddress} 
                                   placeholder={'For example, me@myemail.com'} 
                                   onChange={handleChange}
                                   aria-describedby={bookingFormId + '-email-address-desc'} 
                                   required={formData.contactMethod === 'email'}
                            />
                            <span id={bookingFormId + '-email-address-desc'} 
                                  className="assistiveTexts">(Optional) Enter customer email
                            </span>
                        </li>
                        <li className="lis li-customerComments">
                            <label htmlFor={bookingFormId + '-comments'}>Comments</label>
                            <textarea
                                id={bookingFormId + '-comments'} 
                                name="comments" 
                                value={formData.comments}
                                onChange={handleChange}
                                aria-describedby={bookingFormId + '-comments-desc'} 
                            />
                            <span id={bookingFormId + '-comments-desc'} 
                                  className="assistiveTexts">(Optional) Enter comments
                            </span>
                        </li>
                    </ul>
                </fieldset>
                <div role="group" aria-label="Button group label" className="buttonGroup">
                    <button type="button" className="buttons buttonCancel">Cancel</button>
                    <button type="button" className="buttons buttonConfirmReservation">Confirm reservation</button>
                </div>
            </form>
        </>
    );
};

export default BookingForm; 

