import React, { useState, useId, useEffect } from 'react';
import './BookingForm.css';
import { useNavigate } from 'react-router-dom';

const BookingForm = ({
  className,
  availableTimes,
  resDate,
  resTime,
  handleDateChange,
  handleTimeChange,
  dateError,
  timeError,
  minDate,
  submitAPI,
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
  const [updatedFormData, setUpdatedFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Call the useNavigate hook
  const navigate = useNavigate();

  // Add a new state to control the redirection
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Step 1: Create a reusable validation function
  const validateField = (name, value, allData) => {
    let error = '';
    // Basic validation for required fields
    if (['firstName', 'lastName'].includes(name) && value.trim() === '') {
      error = `${name} is required`;
    }
    // Conditional validation based on contactMethod - Old
    // else if (name === 'phoneNumber' || name === 'emailAddress' || name === 'contactMethod') {
    //   const currentContactMethod = name === 'contactMethod' ? value : allData.contactMethod;
    //   const currentPhoneNumber = name === 'phoneNumber' ? value : allData.phoneNumber;
    //   const currentEmailAddress = name === 'emailAddress' ? value : allData.emailAddress;

    //   if (currentContactMethod === 'phone' && currentPhoneNumber.trim() === '') {
    //     if (name === 'phoneNumber') error = 'Phone number is required';
    //   } else if (currentContactMethod === 'email') {
    //     if (currentEmailAddress.trim() === '') {
    //       if (name === 'emailAddress') error = 'Email address is required';
    //     } else if (!/\S+@\S+\.\S+/.test(currentEmailAddress)) {
    //       if (name === 'emailAddress') error = 'Email address is invalid.';
    //     }
    //   }
    // }

    // Conditional validation based on the currently selected contactMethod - New
    const { contactMethod, phoneNumber, emailAddress } = allData;

    if (name === 'phoneNumber' && contactMethod === 'phone' && phoneNumber.trim() === '') {
      error = 'Phone number is required';
    } else if (name === 'emailAddress' && contactMethod === 'email') {
      if (emailAddress.trim() === '') {
        error = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(emailAddress)) {
        error = 'Email address is invalid.';
      }
    }

    return error;
  };

  // Step 2: Implement a new handleBlur function
  const handleBlur = (e) => {
    // Method - Old
    // const { name, value } = e.target;
    // const error = validateField(name, value, formData);
    // setErrors((prevErrors) => ({
    //   ...prevErrors,
    //   [name]: error,
    // }));

    // Method - New
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // 1. Update the form data with the current value.
    const currentData = { ...formData, [name]: value };

    // 2. Validate the specific field that was blurred.
    const error = validateField(name, value, currentData);
    newErrors[name] = error;

    // 3. Conditionally re-validate the contact fields only if the blur event occurred on one of them.
    // This prevents the error from appearing immediately after selecting a radio button.
    if (name === 'phoneNumber' && currentData.contactMethod === 'phone') {
      const phoneError = validateField('phoneNumber', currentData.phoneNumber, currentData);
      newErrors.phoneNumber = phoneError;
    } else if (name === 'emailAddress' && currentData.contactMethod === 'email') {
      const emailError = validateField('emailAddress', currentData.emailAddress, currentData);
      newErrors.emailAddress = emailError;
    }

    // 4. If the contactMethod is changed, and the user hasn't blurred the conditional field yet,
    // we should clear the error for the field that is no longer required.
    if (name === 'contactMethod') {
      if (currentData.contactMethod === 'phone') {
        newErrors.emailAddress = ''; // Clear email error if phone is selected
      } else if (currentData.contactMethod === 'email') {
        newErrors.phoneNumber = ''; // Clear phone error if email is selected
      }
    }

    setErrors(newErrors);

  };

  // Modified handleChange to only update state without validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'resDate' || name === 'resTime') {
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // For clearing the error as the user types
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Re-validate all fields before submission
    let formIsValid = true;
    const newErrors = {};

    ['firstName', 'lastName'].forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
        formIsValid = false;
      }
    });

    if (formData.contactMethod === 'phone') {
      const error = validateField('phoneNumber', formData.phoneNumber, formData);
      if (error) {
        newErrors.phoneNumber = error;
        formIsValid = false;
      }
    } else if (formData.contactMethod === 'email') {
      const error = validateField('emailAddress', formData.emailAddress, formData);
      if (error) {
        newErrors.emailAddress = error;
        formIsValid = false;
      }
    }

    if (dateError) {
      newErrors.resDate = dateError;
      formIsValid = false;
    }
    if (timeError) {
      newErrors.resTime = timeError;
      formIsValid = false;
    }

    setErrors(newErrors);

    if (formIsValid) {
      console.log('Form submitted with data:', {
        resDate: resDate,
        resTime: resTime,
        ...formData,
      });
      setUpdatedFormData({
        resDate: resDate,
        resTime: resTime,
        ...formData,
      });
        try {
          const response = await submitAPI(formData);
          if(response === true) {
            // Show confirmation modal in these conditions below:
            // 1) the form is successfully validated
            // 2) the submitAPI returns true
            // 3) the form is successfully submitted
            setShowConfirmationModal(true);
            // Then, reset the form data
            resetForm();
            // Set the state to trigger the useEffect for redirection
            setShouldRedirect(true); 
          } else {
            // Handle cases where API responds but indicates a failure
            console.error('API submission failed:', response);
            alert('Form submission failed. Please try again.');
          }
        } catch (error) {
            // Handle actual network or server errors
            console.error('Form submission error:', error);
            alert('An error occurred. Please try again later.');
        }
    } else {
      console.log('Form has errors:', newErrors);
      alert('Please correct the errors in the form.');
    }
  };
  // Let the confirmation model disappear in certain time
  // useEffect(() => {
  //   let timer;
  //   if (showConfirmationModal && shouldRedirect) {
  //     timer = setTimeout(() => {
  //       setShowSuccessModal(false);
  //       // Redirect to the success page
  //       navigate('/confirmation'); 
  //     }, 21000); // Modal disappears after 3 seconds
  //   }
  //   return () => clearTimeout(timer); // Cleanup the timer
  // }, [showSuccessModal, shouldRedirect, navigate]);

  // Let the success model disappear in certain time
  useEffect(() => {
    let timer;
    if (showSuccessModal && shouldRedirect) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
        // Redirect to the success page
        navigate('/confirmation/reservation'); 
      }, 3000); // Modal disappears after 3 seconds
    }
    return () => clearTimeout(timer); // Cleanup the timer
  }, [showSuccessModal, shouldRedirect, navigate]);

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

const handleCancelClick = () => {
  // Do not show the confirmation modal
  setShowConfirmationModal(false);
  // Reset the form data
  resetForm();
}

const handleConfirmClick = () => {
  // Close the confirmation modal
  setShowConfirmationModal(false);
  // Show the success modal
  setShowSuccessModal(true);
};

const handleOkClick = () => {
  // Close the success modal
  setShowSuccessModal(false);
  // Mark that it is a right time to redirect in the shouldRedirect/setShouldRedirect variable
  // Set the state to trigger the useEffect for redirection
  // setShouldRedirect(true);
  // Redirect to the desired page
  navigate('/confirmation/reservation');
};

const formatLabel = (key) => {
  // Convert camelCase or kebab-case to a human-readable string
  return key
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
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
                                   onBlur={handleBlur}
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
                                   onBlur={handleBlur}
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
                                    onBlur={handleBlur}
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
                                    onBlur={handleBlur}
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
                                   onBlur={handleBlur}
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
                                   onBlur={handleBlur}
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
                    <button type="button" className="buttons buttonCancel" onClick={handleCancelClick}>Cancel</button>
                    <button type="submit" 
                            className="buttons buttonConfirmReservation"
                            style={{ backgroundColor: areAllFieldsFilled() ? '#495E57' : '#D0D0D0' , color: areAllFieldsFilled() ? '#ffffffff' : '#000000ff'}}
                    >
                        Confirm reservation
                    </button>
                </div>
                {showConfirmationModal && (
                    <dialog id="confirmationModal" 
                            className="modal"
                            aria-labelledby="confirmationModalTitle"
                            aria-modal="true"
                            open
                    >
                        <div className="modalContent">
                            <button 
                                  type="button"
                                  className="closeButton" 
                                  aria-label="Close confirmation modal"
                                  onClick={() => setShowConfirmationModal(false)}>
                                &times;
                            </button>
                            <h2 id="confirmation-modal-title">Confirm your reservation</h2>
                            <div>
                              <h3 id="user-form-input-title">Your Input:</h3>
                              <div className="form-data-row">
                                {Object.entries(updatedFormData).map(([key, value]) => (
                                  <div key={key} className="form-data-item">
                                    <strong>{formatLabel(key)}:</strong> {value}
                                  </div>
                                ))}
                              </div>

                            </div>
                            <div className="confirmationButtonSet">                            
                              <button 
                                  className="confirmationButton modalCancelButton" 
                                  onClick={() => setShowConfirmationModal(false)}>
                                      Cancel
                              </button>
                              <button 
                                  className="confirmationButton modalButton" 
                                  onClick={handleConfirmClick}>
                                      Confirm
                              </button>
                            </div>
                        </div>
                    </dialog>
                )}
                {showSuccessModal && (
                    <dialog id="successModal" 
                            className="modal"
                            aria-labelledby="successModalTitle"
                            aria-modal="true"
                            open
                    >
                        <div className="modalContent successModalContent">
                            <button 
                                  type="button"
                                  className="closeButton" 
                                  aria-label="Close success modal"
                                  onClick={() => setShowSuccessModal(false)}>
                                &times;
                            </button>
                            <h2 id="success-modal-title">Congratulations!</h2>
                              <h3 id="success-modal-description">You successfully submitted the form. </h3>
                              <button 
                                  className="successButton modalButton" 
                                  onClick={handleOkClick}>
                                      Okay
                              </button>
                        </div>
                    </dialog>
                )}
            </form>
        </>
    );
};

export default BookingForm; 

