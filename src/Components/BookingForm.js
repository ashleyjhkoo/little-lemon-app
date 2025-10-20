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
  // const [firstNameErrors, setFirstNameErrors] = useState({
  //        firstNameRequired: false,
  //        firstNameFormat: false,
  // });
  // const [lastNameErrors, setLastNameErrors] = useState({
  //        lastNameRequired: false,
  //        lastNameFormat: false,
  // });
  const [phoneNumberErrors, setPhoneNumberErrors] = useState({
         phoneNumberRequired: false,
         phoneNumberFormat: false,
  });
  const [emailAddressErrors, setEmailAddressErrors] = useState({
         emailAddressRequired: false,
         emailAddressFormat: false,
  });
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

  // Create a reusable validation function
  const validateField = (name, value, allData) => {
    let error = '';
    // Validation for required name fields
    if (['firstName', 'lastName'].includes(name) && value.trim() === '') {
      if (name === 'firstName') {
        error = `First name is required`;
      } else if (name === 'lastName') {
        error = `Last name is required`;
      } else {
        error = '';
      }
    } 
    // Validation for incorrect name formats
    else if (['firstName', 'lastName'].includes(name) && value.trim() !== '') {
      if (name === 'firstName' && !/^[A-Za-z\s-]+$/.test(value)) {
        error = `First name is invalid`;
      } else if (name === 'lastName' && !/^[A-Za-z\s-]+$/.test(value)) {
        error = `Last name is invalid`;
      } else {
        error = '';
      }
    }

    // Conditional validation based on the currently selected contactMethod - New
    const { contactMethod, phoneNumber, emailAddress } = allData;

    if (name === 'phoneNumber' && contactMethod === 'phone') {
      if (phoneNumber.trim() === '') {
        error = 'Phone number is required';
        setPhoneNumberErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumberRequired: true,
        }));
      } else if (!/^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/.test(phoneNumber)) {
        error = 'Phone number is invalid';
        setPhoneNumberErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumberFormat: true,
        }));
      } 
      else {
        error = '';
      }
    } else if (name === 'emailAddress' && contactMethod === 'email') {
      if (emailAddress.trim() === '') {
        error = 'Email address is required';
        setEmailAddressErrors((prevErrors) => ({
          ...prevErrors,
          emailAddressRequired: true,
        }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
        error = 'Email address is invalid';
        setEmailAddressErrors((prevErrors) => ({
          ...prevErrors,
          emailAddressFormat: true,
        }));
      } 
      else {
        error = '';
      }
    }

    if (name === 'emailAddress' && value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && contactMethod === 'phone') {
      error = 'Email address is invalid';
      setEmailAddressErrors((prevErrors) => ({
        ...prevErrors,
        emailAddressFormat: true,
      }));
    }
    
    if (name === 'phoneNumber' && value.trim() !== '' && !/^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/.test(value) && contactMethod === 'email') {
      error = 'Phone number is invalid';
      setPhoneNumberErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumberFormat: true,
      }));
    }

    // if (name === 'emailAddress' && value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    //   error = 'Email address is invalid';
    // }
    
    // if (name === 'phoneNumber' && value.trim() !== '' && !/^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/.test(value)) {
    //   error = 'Phone number is invalid';
    // }

    return error;
  };

  // Step 2: Implement a new handleBlur function
  const handleBlur = (e) => {

    // Method - New
    const { name, value } = e.target;
    const newErrors = { ...errors };

    // 1. Update the form data with the current value.
    const currentData = { ...formData, [name]: value };

    // 2. Validate the specific field that was blurred.
    const error = validateField(name, value, currentData);
    newErrors[name] = error;

    // 3. After blur, re-evaluate the other contact method's required status if the blurred field was a contact field
    // if (name === 'phoneNumber' || name === 'emailAddress') {
    //   // Check required status for the currently selected contact method
    //   const contactMethod = currentData.contactMethod;
    //   if (contactMethod === 'phone') {
    //     newErrors.phoneNumber = validateField('phoneNumber', currentData.phoneNumber, currentData);
    //     newErrors.emailAddress = ''; // Clear error for the unselected contact method
    //   } else if (contactMethod === 'email') {
    //     newErrors.emailAddress = validateField('emailAddress', currentData.emailAddress, currentData);
    //     newErrors.phoneNumber = ''; // Clear error for the unselected contact method
    //   }
    // }

    const contactMethod = currentData.contactMethod;
    const phoneRegex = /^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Check for phoneNumber required error (only if contactMethod is 'phone')
    if (contactMethod === 'phone' && name === 'phoneNumber' && !value.trim()) {
      setPhoneNumberErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumberRequired: true,
      }));
      newErrors.phoneNumber = validateField('phoneNumber', currentData.phoneNumber, currentData);
      newErrors.emailAddress = ''; // Clear error for the unselected contact method
    }
    
    // Check for phoneNumber format error (if a value is present and the format is invalid)
    if (name === 'phoneNumber' && value.trim() && !phoneRegex.test(value)) {
      setPhoneNumberErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumberFormat: true,
      }));
      newErrors.phoneNumber = validateField('phoneNumber', currentData.phoneNumber, currentData);
    }

    // Check for emailAddress required error (only if contactMethod is 'email')
    if (contactMethod === 'email' && name === 'emailAddress' && !value.trim()) {
      setEmailAddressErrors((prevErrors) => ({
        ...prevErrors,
        emailAddressRequired: true,
      }));
      newErrors.emailAddress = validateField('emailAddress', currentData.emailAddress, currentData);
      newErrors.phoneNumber = ''; // Clear error for the unselected contact method
    }
    
    // Check for emailAddress format error (if a value is present and the format is invalid)
    if (name === 'emailAddress' && value.trim() && !emailRegex.test(value)) {
      setEmailAddressErrors((prevErrors) => ({
        ...prevErrors,
        emailAddressFormat: true,
      }));
      newErrors.emailAddress = validateField('emailAddress', currentData.emailAddress, currentData);
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

    const currentData = { ...formData, [name]: value };

    // Update errors for real-time format validation
    setErrors((prevErrors) => {
      const error = validateField(name, value, currentData);
      const newErrors = { ...prevErrors };

      newErrors[name] = error;
      
      // Real-time email validation
      if (name === 'emailAddress') {
        if (value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setEmailAddressErrors((prevErrors) => ({
            ...prevErrors,
            emailAddressFormat: true,
          }));
          newErrors.emailAddress = 'Email address is invalid';
        } else {
          setEmailAddressErrors((prevErrors) => ({
            ...prevErrors,
            emailAddressFormat: false,
          }));
          newErrors.emailAddress = '';
        }
      }
      // Real-time phone number validation
      else if (name === 'phoneNumber') {
        if (value.trim() !== '' && !/^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/.test(value)) {
        setPhoneNumberErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumberFormat: true,
        }));
          newErrors.phoneNumber = 'Phone number is invalid';
        } else {
          setPhoneNumberErrors((prevErrors) => ({
            ...prevErrors,
            phoneNumberFormat: false,
          }));
          newErrors.phoneNumber = '';
        }
      }

      // Real-time first name validation
      else if (name === 'firstName') {
        newErrors.firstName = (value.trim() !== '' && !/^[a-zA-Z ]*$/.test(value))
          ? 'First name is invalid'
          : '';
      }

      // Real-time last name validation
      else if (name === 'lastName') {
        newErrors.lastName = (value.trim() !== '' && !/^[a-zA-Z ]*$/.test(value))
          ? 'Last name is invalid'
          : '';
      }

      // Real-time email format error validation in non-required emailAddress or phoneNumber input fields
      // if (name === 'emailAddress' && value.trim() !== '' && !/\S+@\S+\.\S+/.test(value) && currentData.contactMethod === 'phone') {
      //   newErrors.emailAddress = 'Email address is invalid'
      // } else if (name === 'phoneNumber' && value.trim() !== '' && !/^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/.test(value) && currentData.contactMethod === 'email') {
      //   newErrors.phoneNumber = 'Phone number is invalid'
      // }

      // Clear error for other fields on typing
      // else if (newErrors[name]) {
      //   newErrors[name] = '';
      // }
      // Clear the error for the other contact method if contactMethod changes
      // if (name === 'contactMethod') {
      //   if (value === 'phone') {
      //     newErrors.emailAddress = '';
      //   } else {
      //     newErrors.phoneNumber = '';
      //   }
      // }
      return newErrors;
    });
    
  };

  // Handle events when the user submits the submission type button
  const handleSubmit = async (e) => {
    // Prevent the default browser submission behavior
    e.preventDefault();
    const { name, value } = e.target;
    const phoneRegex = /^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Re-validate all fields before submission

    // Initiate the variables
    let formIsValid = true;
    const newErrors = {};

    // Re-validate the first and last names before submission
    ['firstName', 'lastName'].forEach((field) => {
      const error = validateField(field, formData[field], formData);
      if (error) {
        newErrors[field] = error;
        formIsValid = false;
      }
    });

    // Check for phoneNumber required error (only if contactMethod is 'phone')
    if (formData.contactMethod === 'phone' && name === 'phoneNumber' && !value.trim()) {
      const error = validateField('phoneNumber', formData.phoneNumber, formData);
      if (error) {
        setPhoneNumberErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumberRequired: true,
        }));
        formIsValid = false;
        newErrors.phoneNumber = error;
        newErrors.emailAddress = ''; // Clear error for the unselected contact method
      }
    }
    
    // Check for phoneNumber format error (if a value is present and the format is invalid)
    if (name === 'phoneNumber' && value.trim() && !phoneRegex.test(value)) {
      const error = validateField('phoneNumber', formData.phoneNumber, formData);
      if (error) {
        setPhoneNumberErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumberFormat: true,
        }));
        formIsValid = false;
        newErrors.phoneNumber = error;
      }
    }

    // Check for emailAddress required error (only if contactMethod is 'email')
    if (formData.contactMethod === 'email' && name === 'emailAddress' && !value.trim()) {
      const error = validateField('emailAddress', formData.emailAddress, formData);
      if (error) {
        setEmailAddressErrors((prevErrors) => ({
          ...prevErrors,
          emailAddressRequired: true,
        }));
        formIsValid = false;
        newErrors.emailAddress = error;
        newErrors.phoneNumber = ''; // Clear error for the unselected contact method
      }
    }
    
    // Check for emailAddress format error (if a value is present and the format is invalid)
    if (name === 'emailAddress' && value.trim() && !emailRegex.test(value)) {
      const error = validateField('emailAddress', formData.emailAddress, formData);
      if (error) {
        setEmailAddressErrors((prevErrors) => ({
          ...prevErrors,
          emailAddressFormat: true,
        }));
        formIsValid = false;
        newErrors.emailAddress = error;
      }
    }

    // Re-validate the phone and email contact method option before submission
    // if (formData.contactMethod === 'phone' || formData.contactMethod === 'email') {
    //   const phoneError = validateField('phoneNumber', formData.phoneNumber, formData);
    //   const emailError = validateField('emailAddress', formData.emailAddress, formData);
    //   if (phoneError || emailError) {
    //     newErrors.phoneNumber = phoneError;
    //     newErrors.emailAddress = emailError;
    //     formIsValid = false;
    //   }
    // } 

    // Re-validate upon the submission according to the user's contact method selection
    // validateField function validates all possible errors of the required & format error
    // for each input field of the phoneNumber and emailAddress
    if (formData.contactMethod === 'phone') {
      const phoneError = validateField('phoneNumber', formData.phoneNumber, formData);
      const emailError = validateField('emailAddress', formData.emailAddress, formData);
      if (phoneError) {
        newErrors.phoneNumber = phoneError;
        formIsValid = false;
      }
      if (emailError) {
        newErrors.emailAddress = emailError;
        formIsValid = false;
      }
    } 
    else if (formData.contactMethod === 'email') {
      const emailError = validateField('emailAddress', formData.emailAddress, formData);
      const phoneError = validateField('phoneNumber', formData.phoneNumber, formData);
      if (emailError) {
        newErrors.emailAddress = emailError;
        formIsValid = false;
      }
      if (phoneError) {
        newErrors.phoneNumber = phoneError;
        formIsValid = false;
      }
    } 

    // Re-validate the parent's dateError and timeError props before submission
    if (dateError) {
      newErrors.resDate = dateError;
      formIsValid = false;
    }
    if (timeError) {
      newErrors.resTime = timeError;
      formIsValid = false;
    }

    // If there's any new errors during this submission event hanlder click, put new errors in the global errors/setErrors useState hook
    setErrors(newErrors);

    // If the form is valid, then display the success message in the console.log
    // Then, update the global 'formData' useState hook variable combining the resData, resTime props from the parent component
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
        // Then, check the web API to display the confirmation modal
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
        // If the web API returns false, then perform below
        } catch (error) {
            // Handle actual network or server errors
            console.error('Form submission error:', error);
            alert('An error occurred. Please try again later.');
        }
    // If the form is not valid, display error message through the console.log and alert screen    
    } else {
      console.log('Form has errors:', newErrors);
      alert('Please correct the errors in the form.');
    }
  };

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

  // Checking if all mandatory fields are filled
  // Based on the return result of this function as 'true' or 'false',
  // it renders the 'Confirm reservation' button's CSS styles in the main return function's JSX area
  const areAllFieldsFilled = (e) => {
    // Define which fields are considered mandatory for submission
    const mandatoryFields = [
        'firstName',
        'lastName',
        'contactMethod',
    ];

    const isValidFirstName = (firstName) => {
    // Regex to check for a basic first name format: characters
    const firstNameRegex = /^[a-zA-Z ]*$/;
    return firstNameRegex.test(firstName);
    };

    const isValidLastName = (lastName) => {
    // Regex to check for a basic last name format: characters
    const lastNameRegex = /^[a-zA-Z ]*$/;
    return lastNameRegex.test(lastName);
    };

    const isValidPhone = (phone) => {
    // Regex to check for a basic phone format: number + 10 digits
    const phoneRegex = /^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$/;
    return phoneRegex.test(phone);
    };

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
        // if (!isValidPhone) {
        //   return false;
        // } else if (!isValidEmail) {
        //   return false;
        // }

        if (typeof formData[field] === 'string' && formData[field].trim() === '') {
            console.error(`Error: The mandatory field '${field}' is empty.`);
            return false; // A mandatory string field is empty
        }
    }

    // Validate first name's format outside of the mandatory field loop
    if (formData.firstName && formData.firstName.trim() !== '' && !isValidFirstName(formData.firstName)) {
      console.error(`Error: The first name '${formData.firstName}' is not a valid format.`);
      return false;
    }

    // Validate last name's format outside of the mandatory field loop
    if (formData.lastName && formData.lastName.trim() !== '' && !isValidLastName(formData.lastName)) {
      console.error(`Error: The last name '${formData.lastName}' is not a valid format.`);
      return false;
    }

    // Validate phone number if it exists, regardless of whether it's mandatory
    if (formData.phoneNumber && formData.phoneNumber.trim() !== '' && !isValidPhone(formData.phoneNumber)) {
      console.error(`Error: The phone number '${formData.phoneNumber}' is not a valid format.`);
      return false;
    }

    // Validate email address if it exists, regardless of whether it's mandatory
    if (formData.emailAddress && formData.emailAddress.trim() !== '' && !isValidEmail(formData.emailAddress)) {
      console.error(`Error: The email address '${formData.emailAddress}' is not a valid format.`);
      return false;
    }

        // You might also want to check for other types of empty values if applicable,
        // e.g., if (formData[field] === null || formData[field] === undefined)

        // // Special validation for phoneNumber if it is a mandatory field
        // if (field === 'phoneNumber' && !isValidPhone(formData[field])) {
        // console.error(`Error: The phone number '${formData[field]}' is not a valid format.`);
        // return false; // phone number is not in a valid format
        // }

        // if (field === 'phoneNumber' && !isValidPhone(formData[field]) && formData.contactMethod === 'email') {
        // console.error(`Error: The phone number '${formData[field]}' is not a valid format.`);
        // return false; // phone number is not in a valid format
        // }

        // // Special validation for emailAddress if it is a mandatory field
        // if (field === 'emailAddress' && !isValidEmail(formData[field])) {
        // console.error(`Error: The email address '${formData[field]}' is not a valid format.`);
        // return false; // Email address is not in a valid format
        // }

        // if (field === 'emailAddress' && !isValidEmail(formData[field]) && formData.contactMethod === 'phone') {
        // console.error(`Error: The email address '${formData[field]}' is not a valid format.`);
        // return false; // Email address is not in a valid format
        // }

    return true; // All mandatory fields are filled
};

// Trigger this event handler when the Cancel button is clicked on the booking form
const handleCancelClick = () => {
  // Do not show the confirmation modal
  setShowConfirmationModal(false);
  // Reset the form data
  resetForm();
}

// Trigger this event handler when the Confirm button is clicked on the confirmation modal
const handleConfirmClick = () => {
  // Close the confirmation modal
  setShowConfirmationModal(false);
  // Show the success modal
  setShowSuccessModal(true);
};

// Trigger this event handler when the Ok button is clicked on the success modal
const handleOkClick = () => {
  // Close the success modal
  setShowSuccessModal(false);
  // Mark that it is a right time to redirect in the shouldRedirect/setShouldRedirect variable
  // Set the state to trigger the useEffect for redirection
  // setShouldRedirect(true);
  // Redirect to the desired page
  navigate('/confirmation/reservation');
};

// Convert camelCase or kebab-case labels to a human-readable string
// This function re-formats the data that is displayed on the Confirmation modal
const formatLabel = (key) => {
  return key
    .replace(/-/g, ' ') // Replace dashes with spaces
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};

return (
        <>
            {/*When the button type set up as the 'button' is clicked, this 'handleSubmnit' event handler is triggered*/}
            <form className={className} onSubmit={handleSubmit} aria-label="my booking form">
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
                                   // Bind value with the 'resDate' prop which was handed down from the parent component
                                   value={resDate} 
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
                                    // Bind value with the 'resTime' prop which was handed down from the parent component
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
                                  //  pattern="^[A-Za-z\s-]+$"
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   aria-describedby={bookingFormId + '-first-name-desc'}
                                  //  required
                            />
                            {errors.firstName && <p style={{ color: 'red' }} className="errorTexts">{errors.firstName}</p>}
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
                                  //  pattern="^[A-Za-z\s-]+$"
                                   onChange={handleChange} 
                                   onBlur={handleBlur}
                                   aria-describedby={bookingFormId + '-last-name-desc'}
                                  //  required
                            />
                            {errors.lastName && <p style={{ color: 'red' }} className="errorTexts">{errors.lastName}</p>}
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
                                   // This pattern attribute validates the client side phone number input value
                                   pattern="^\d{3}-?\d{3}-?\d{4}$"
                                  //  pattern="^(?:\+\d{1,3}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$"
                                   placeholder={'For example, 123-456-7890'} 
                                   onChange={handleChange} 
                                   onBlur={handleBlur}
                                   aria-describedby={formData.contactMethod === 'phone' ? bookingFormId + '-phone-number-desc' : undefined} 
                            />
                            {/*Display the phoneNumber required error message when the contact method is phone and the value is empty*/}
                            {phoneNumberErrors.phoneNumberRequired && !phoneNumberErrors.phoneNumberFormat && formData.contactMethod === 'phone' && (<p style={{ color: 'red' }} className="errorTexts">{errors.phoneNumber}</p>)}
                            {/*Display the phoneNumber format error message when the value is incorrect phone number format*/}
                            {phoneNumberErrors.phoneNumberFormat && formData.phoneNumber !== '' && (<p style={{ color: 'red' }} className="errorTexts">{errors.phoneNumber}</p>)}
                            {/*When the contact method is phone, then display the phone number assistive text saying the phone number is required*/}
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
                                   pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                   placeholder={'For example, me@myemail.com'} 
                                   onChange={handleChange}
                                   onBlur={handleBlur}
                                   aria-describedby={formData.contactMethod === 'email' ? bookingFormId + '-email-address-desc' : undefined} 
                            />
                            {/*Display the emailAddress required error message when the contact method is email and the value is empty*/}
                            {emailAddressErrors.emailAddressRequired && !emailAddressErrors.emailAddressFormat &&formData.contactMethod === 'email' && (<p style={{ color: 'red' }} className="errorTexts">{errors.emailAddress}</p>)}
                            {/*Display the emailAddress format error message when the value is incorrect email format*/}
                            {emailAddressErrors.emailAddressFormat && formData.emailAddress !== '' && (<p style={{ color: 'red' }} className="errorTexts">{errors.emailAddress}</p>)}
                            {/*When the contact method is email, then display the email address assistive text saying the email address is required*/}
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
                {/*Booking form's Cancel and Confirm reservation buttons*/}
                <div role="group" aria-label="Button group label" className="buttonGroup">
                    <button type="button" className="buttons buttonCancel" onClick={handleCancelClick}>Cancel</button>
                    <button type="submit" 
                            className="buttons buttonConfirmReservation"
                            style={{ backgroundColor: areAllFieldsFilled() ? '#495E57' : '#D0D0D0' , color: areAllFieldsFilled() ? '#ffffffff' : '#000000ff'}}
                            aria-label="Confirm reservation"
                    >
                        Confirm reservation
                    </button>
                </div>
                {/*Show confirmation modal if it is set up as true*/}
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
                              {/*Get the form data and convert to a formatted data and display*/}
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
                {/*Show success modal if it is set up as true*/}
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
