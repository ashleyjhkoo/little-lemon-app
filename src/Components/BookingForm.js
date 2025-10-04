import React, { useState, useId, useEffect } from 'react';
import './BookingForm.css';

const BookingForm = ({ className, 
                       availableTimes, 
                       resDate,
                       resTime,
                       handleDateChange,
                       handleTimeChange,
                       dateError,
                       timeError,
                       minDate
}) => {
    const bookingFormId = useId();
    const initialFormData = {
        occasion: 'Birthday',
        guests: 1,
        firstName: '',
        lastName: '',
        contactMethod: 'phone',
        phoneNumber: '',
        emailAddress: '',
        comments: '',
    };
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});   
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const resetForm = () => {
        setFormData(initialFormData);
    };

    // this function controls all user input updates
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'resDate' || name === 'resTime') {
            return;
        }
        const newErrors = { ...errors };
        
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Basic validation for required fields
        if (['firstName', 'lastName'].includes(name) && value.trim() === '') {
            newErrors[name] = `${name} is required`;
        } else if (['firstName', 'lastName'].includes(name)) {
            newErrors[name] = ''; // Clear error if field is filled
        }

        // Conditional validation based on contactMethod
        if (name === 'contactMethod' || name === 'phoneNumber' || name === 'emailAddress') {
            const currentContactMethod = name === 'contactMethod' ? value : formData.contactMethod;
            const currentPhoneNumber = name === 'phoneNumber' ? value : formData.phoneNumber;
            const currentEmailAddress = name === 'emailAddress' ? value : formData.emailAddress;

            if (currentContactMethod === 'phone') {
                if (currentPhoneNumber.trim() === '') {
                    newErrors.phoneNumber = 'Phone number is required';
                } else {
                    newErrors.phoneNumber = '';
                }
                newErrors.emailAddress = ''; // Clear email error if phone is selected
            } else if (currentContactMethod === 'email') {
                if (currentEmailAddress.trim() === '') {
                    newErrors.emailAddress = 'Email address is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
                    newErrors.emailAddress = 'Email address is invalid.';
                } else {
                    newErrors.emailAddress = '';
                }
                newErrors.phoneNumber = ''; // Clear phone error if email is selected
            } else { // Handle cases where contactMethod is not yet selected or an invalid option
                newErrors.phoneNumber = '';
                newErrors.emailAddress = '';
            }
        }

        setErrors(newErrors);

        // Inside handleChange, after updating errors for the current field
        // the error messages disappear as soon as the required input fields are filled beform the form submission
        const allRequiredFieldsFilled = Object.keys(initialFormData).every(key => {
        // Assuming 'firstName', 'phoneNumber', 'emailAddress' are required
            if (['firstName', 'phoneNumber', 'emailAddress'].includes(key)) {
                return formData[key].trim() !== '';
            }
            return true; // Non-required fields are considered "filled"
        });

        if (allRequiredFieldsFilled) {
            setErrors({}); // Clear all errors if all required fields are filled
        }

    };

    // Perform this function when the submit button is clicked
    const handleSubmit = (e) => {    
        //Prevent default form submission
        e.preventDefault();

        // Perform final validation before submission
        let formIsValid = true;
        const finalErrors = { ...errors };

        // Check `resDate` and `resTime` validation errors passed from the parent component
        if (dateError) {
            formIsValid = false;
        }
        if (timeError) {
            formIsValid = false;
        }

        // Re-check required fields
        ['firstName', 'lastName'].forEach(field => {
            if (formData[field].trim() === '') {
                finalErrors[field] = `${field} is required`;
                formIsValid = false;
            }
        });

        // Re-check conditional validation
        if (formData.contactMethod === 'phone' && formData.phoneNumber.trim() === '') {
            finalErrors.phoneNumber = 'Phone number is required';
            formIsValid = false;
        } else if (formData.contactMethod === 'email' && formData.emailAddress.trim() === '') {
            finalErrors.emailAddress = 'Email address is required';
            formIsValid = false;
        }

        setErrors(finalErrors);

        // this is the final validation check before submitting the form
        // if all required validations are satisfied (formIsValid = true), perform if statement
        // otherwise, perform else statement
        if (formIsValid) {
            // Access the updated formData here
            console.log('Form submitted with data:', {
                resDate: resDate, // Access from props
                resTime: resTime, // Access from props
                ...formData
            });
            // You can now send formData to an API or perform other actions
            setShowSuccessModal(true);
            resetForm();
        } else {
            console.log('Form has errors:', finalErrors);
            alert('Please correct the errors in the form.');
        }
    };

    // Show success modal after the form is successfully submitted
    // And let it disappear after 3 seconds
    useEffect(() => {
        let timer;
        if (showSuccessModal) {
        timer = setTimeout(() => {
            setShowSuccessModal(false);
        }, 3000); // Modal disappears after 3 seconds
        }
        return () => clearTimeout(timer); // Cleanup the timer
    }, [showSuccessModal]);

    const areAllFieldsFilled = (e) => {
        // Define which fields are considered mandatory for submission
        const mandatoryFields = [
            'firstName',
            'lastName',
            'contactMethod',
        ];

        const isValidEmail = (email) => {
        // Regex to check for a basic email format (user@domain.tld)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
        };

        // If contactMethod is 'phone', then phoneNumber is mandatory.
        // If contactMethod is 'email', then emailAddress is mandatory.
        if (formData.contactMethod === 'phone') {
            mandatoryFields.push('phoneNumber');
        } else if (formData.contactMethod === 'email') {
            mandatoryFields.push('emailAddress');
        }

        // Check if all mandatory fields are filled
        for (const field of mandatoryFields) {
            if (typeof formData[field] === 'string' && formData[field].trim() === '') {
                console.error(`Error: The mandatory field '${field}' is empty.`);
                return false; // A mandatory string field is empty
            }
            // You might also want to check for other types of empty values if applicable,
            // e.g., if (formData[field] === null || formData[field] === undefined)

            // Special validation for emailAddress if it is a mandatory field
            if (field === 'emailAddress' && !isValidEmail(formData[field])) {
            console.error(`Error: The email address '${formData[field]}' is not a valid format.`);
            return false; // Email address is not in a valid format
            }
        }

        return true; // All mandatory fields are filled
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
                                   value={resDate} // Bind value to the prop
                                   onChange={handleDateChange}
                                   min={minDate}
                                   aria-describedby={bookingFormId + '-res-date-desc'}
                            />
                            {dateError && <p style={{ color: 'red' }}>{dateError}</p>}
                            <span id={bookingFormId + '-res-date-desc'} 
                                  className="assistiveTexts">(Required) Choose reservation date
                            </span>
                        </li>
                        <li className="lis li-reservationTime">
                            <label htmlFor={bookingFormId + '-res-time'}>Reservation time</label>
                            <select id={bookingFormId + '-res-time'}
                                    name="resTime"
                                    value={resTime}
                                    onChange={handleTimeChange}
                                    aria-describedby={bookingFormId + '-res-time-desc'}
                            >
                                {availableTimes.map((time) => (
                                <option key={time}>{time}</option>
                                ))}
                            </select>
                            {timeError && <p style={{ color: 'red' }}>{timeError}</p>}
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
                            />
                            {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
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
                            />
                            {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
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
                                   aria-describedby={formData.contactMethod === 'phone' ? bookingFormId + '-phone-number-desc' : undefined} 
                            />
                            {errors.phoneNumber && formData.contactMethod === 'phone' && (<p style={{ color: 'red' }}>{errors.phoneNumber}</p>)}
                            {formData.contactMethod === 'phone' ? (
                                <span id={bookingFormId + '-phone-number-desc'} 
                                      className="assistiveTexts">(Required) Enter customer phone
                                </span>
                            ) : (
                                <span id={bookingFormId + '-phone-number-desc'} 
                                      className="assistiveTexts">(Optional) Enter customer phone
                                </span>
                            )}    
                        </li>
                        <li className="lis li-contactInformationEmail">
                            <label htmlFor={bookingFormId + '-email-address'}>Email</label>
                            <input type="email" 
                                   id={bookingFormId + '-email-address'} 
                                   name="emailAddress" 
                                   value={formData.emailAddress} 
                                   placeholder={'For example, me@myemail.com'} 
                                   onChange={handleChange}
                                   aria-describedby={formData.contactMethod === 'email' ? bookingFormId + '-email-address-desc' : undefined} 
                            />
                            {errors.emailAddress && formData.contactMethod === 'email' && (<p style={{ color: 'red' }}>{errors.emailAddress}</p>)}
                            {formData.contactMethod === 'email' ? (
                                <span id={bookingFormId + '-email-address-desc'} 
                                      className="assistiveTexts">(Required) Enter customer email
                                </span>
                            ) : (
                                <span id={bookingFormId + '-email-address-desc'} 
                                      className="assistiveTexts">(Optional) Enter customer email
                                </span>
                            )}
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
                    <button type="submit" 
                            className="buttons buttonConfirmReservation"
                            //disabled={!areAllFieldsFilled()}
                            style={{ backgroundColor: areAllFieldsFilled() ? '#495E57' : '#D0D0D0' , color: areAllFieldsFilled() ? '#ffffffff' : '#000000ff'}}
                    >
                        Confirm reservation
                    </button>
                </div>
                {showSuccessModal && (
                    <dialog id="successModal" 
                            className="modal"
                            aria-labelledby="successModalTitle"
                            aria-modal="true"
                            open
                    >
                        <div className="modalContent">
                            <button 
                                  type="button"
                                  className="closeButton" 
                                  aria-label="Close success modal"
                                  onClick={() => setShowSuccessModal(false)}>
                                &times;
                            </button>
                            <h2>Success!</h2>
                            <p>Your form has been submitted successfully.</p>
                            <button 
                                className="modalButton" 
                                onClick={() => setShowSuccessModal(false)}>
                                    OK
                            </button>
                        </div>
                    </dialog>
                )}
            </form>
        </>
    );
};

export default BookingForm; 

