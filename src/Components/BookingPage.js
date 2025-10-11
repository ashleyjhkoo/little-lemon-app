import React, { useReducer, useState, useEffect } from 'react';
import './BookingPage.css';
import BookingForm from './BookingForm';
import ViewMyReservationForm from './ViewMyReservationForm';
import {fetchAPI, submitAPI} from '../API/WebAPI';

export const initialTimes = ['17:00', '18:00', '19:00', '20:00', '21:00'];

// Reducer function to handle state changes for available times
export const updateTimes = (state, action) => {
    switch (action.type) {
        case 'SET_TIMES':
            return action.payload;
        default:
            return state;
    }
};

// Initialization function, now using the actual API call
export const initializeTimes = async () => {
  try {
        // Initialize with current date's times
        // Call API for today's times - from the MockAPI.js file
        // const times = await fetchAPI(new Date()); 

        // Call live API for today's times - from the live web API
        const times = await fetchAPI(new Date());     

        return times;
  // Initialize with initialTimes in case of the error
  // Fallback to hardcoded times on error
  } catch (error) {
        console.error("Failed to fetch initial times:", error);
        return initialTimes; 
  }
};

const formatDate = (date) => {
  // Method 1
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;

  // Method 2
  return date.toISOString().slice(0, 10);
};

const BookingPage = (tabs) => {
    // State to track active tab
    const [activeTab, setActiveTab] = useState('tab1');

    // For styling
    const bookingBgClass = 'bg-container_bookingPage';
    const bookingContentClass = 'content-container_bookingPage';
    const formClass = 'form-container_bookingForm';
    const viewFormClass = 'form-container_viewMyReservationForm';

    // Toggle tab visibility
    const handleTabClick = (tab) => {
        // setActiveTab(activeTab === tab ? null : tab);
        setActiveTab(tab);
    }

    // useReducer hook: 
    // It catch up the available time slots depending on the date selection on the calender using the Fetch API
    // It also provides the action of setting up new times through the upateTimes
    // Dispatch function can be used to mark the action type whereever to apply this hook
    const [availableTimes, dispatch] = useReducer(updateTimes, initialTimes);

    // State for reservation date and time
    const [resDate, setResDate] = useState('');
    const [resTime, setResTime] = useState('');

    // State for validation errors
    const [dateError, setDateError] = useState('');
    const [timeError, setTimeError] = useState('');

    // Calculate today's date in YYYY-MM-DD format
    const today = new Date();
    const minDate = formatDate(today);

    // Handler for date changes and validation
    const handleDateChange = async (e) => {
        // Save new user date input into newDate variable
        const newDateInput = e.target.value;
        // Update the resDate with a new date input
        setResDate(newDateInput); 
        // Date validation logic below
        if (!newDateInput) {
            setDateError('Reservation date is required');
        } else {
            setDateError('');
        }
        // Call API and fetch matching available times for the new date input and save to newTimes variable
        const newTimes = await fetchAPI(resDate);

        // When a new date is selected, new times are assigned to the resTime
        // This covers the case that the user doesn't select any time
        // But, when the user selects the time, a selected time is assigned to the resTime
        if (newTimes.length > 0) {
            setResTime(newTimes[0]);
        }

        // When a new date input occurs, it calls the dispatch function:
        // (1) In the dispatch function, it sets up the type as 'SET_TIMES' 
        // (2) and data from fetched available times(newTimes) based on the date selection
        // (3) sends these actions of (1), (2) to the updateTimes reducer
        dispatch({ type: 'SET_TIMES', payload: newTimes });
        
    };

    // Handler for time changes and validation
    const handleTimeChange = (e) => {
        // Save new user time input into newDate variable
        const newTime = e.target.value;
        // Update resTime with a new time input
        setResTime(newTime);
        // Time validation logic below
        // If no time is selected
        if (!newTime) {
            // Display the error message
            setTimeError('Reservation time is required');
            //setResTime(availableTimeSlots[0]);
        } else {
            setTimeError('');
        }
    };

    // Type A. Use a useEffect hook to handle side effects like data fetching:
    // Fetch the available times from the API and re-run whenever new date is selected
    // useEffect(() => {
    //     if (selectedDate) {
    //         const times = fetchAPI(selectedDate);
    //         dispatch({ type: 'UPDATE_TIMES', payload: times });
    //     }
    //Re-run effect when selectedDate changes
    // }, [selectedDate]); 

    // Type B. Use a useEffect hook to handle side effects like data fetching:
    // Fetch initial data of today's available time slots from API or initialTimes on error
    // when the component is first added to the DOM mounted
    useEffect(() => {
        const today = new Date();
        const formattedToday = formatDate(today);
        const getInitialTimes = async () => {
            const times = await initializeTimes();
            dispatch({ type: 'SET_TIMES', payload: times });
            if (times.length > 0) {
                setResTime(times[0]);
            }
        };
        getInitialTimes();
        // Format today's date object to conform to 'yyyy-MM-dd'
        // this initializes the resDate with formatted today's date
        setResDate(formattedToday);
    // Empty dependency array ensures this runs only once
    }, []); 

    return (
        <main className={bookingBgClass}>
            <section className={bookingContentClass}>
                <ul className="tabs-container" role="tablist">
                        <li
                            className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}
                            onClick={() => handleTabClick('tab1')}
                            role="tab"
                            id="reservations-title"
                        >
                            Reserve a Table
                        </li>
                        <li
                            className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}
                            onClick={() => handleTabClick('tab2')}
                            role="tab"
                            id="view-reservation-title"
                        >
                            View My Reservation
                        </li>
                </ul>
                <div className="tab-content-container">
                    {/* <div className={`tab-content ${activeTab === 'tab1' ? 'visible' : ''}`}> */}
                        {/* Content for Tab 1 goes here */}
                        {/* <h1 id="reservations-title">Reserve a Table</h1> */}
                    {activeTab === 'tab1' && (
                        <div className="tab-content">
                            <BookingForm 
                                className={formClass} 
                                availableTimes={availableTimes}
                                resDate={resDate}
                                resTime={resTime}
                                handleDateChange={handleDateChange}
                                handleTimeChange={handleTimeChange}
                                dateError={dateError}
                                timeError={timeError}
                                minDate={minDate} // It disables the past dates
                                submitAPI={submitAPI}
                            />
                        </div>
                    )}
                    {/* Content for Tab 2 goes here */}
                    {/* <div className={`tab-content ${activeTab === 'tab2' ? 'visible' : ''}`}> */}
                    {/* <h1 id="view-reservation-title">View My Reservation</h1> */}
                    {activeTab === 'tab2' && (
                        <div className="tab-content">
                            <ViewMyReservationForm 
                                className={viewFormClass}
                            />
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default BookingPage; 