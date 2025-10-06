import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import BookingForm from './Components/BookingForm';
import BookingPage from './Components/BookingPage';
import { initializeTimes, updateTimes, initialTimes } from './Components/BookingPage';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import { jest } from '@jest/globals';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Header from './Components/Header';
import Footer from './Components/Footer';

// Mock the child components to avoid issues with their internal dependencies
jest.mock('./Components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./Components/Footer', () => () => <div data-testid="footer">Footer</div>);

// Mock the external API dependency
const mockFetchAPI = jest.fn();
jest.mock('./Components/MockAPI', () => ({
  fetchAPI: () => mockFetchAPI(),
}));

// Mock the BookingPage module using unstable_mockModule
jest.unstable_mockModule('./Components/BookingPage', () => ({
  // Define initializeTimes as a mock function that returns mock data
  initializeTimes: jest.fn(() => ({ /* mock data */ })),
  // Mock the hardcoded initialTimes directly
  initialTimes: ['17:00', '18:00', '19:00'],
}));

// Dynamically import the module to be tested *after* the mock is defined
//const { initializeTimes } = await import('./BookingPage');


describe('App', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // You can add more specific assertions here if needed
  });

  it('renders the Header and Footer components', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    // Check if the Header and Footer components are in the document
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});

describe("Booking Form", () => {
  test('renders the booking form', () => {
      // Define a mock array of available times
      const mockAvailableTimes = ['17:00', '18:00', '19:00'];
      const handleSubmit = jest.fn();
      const firstName = 'Jane';

      render(<BookingForm availableTimes={mockAvailableTimes} firstName={firstName} onSubmit={handleSubmit} />);
     
      const headingElement = screen.getByText("Reservation details");
      expect(headingElement).toBeInTheDocument();

      // Assert that the component renders correctly
      // For example, check that the "Choose time" label is present
      const chooseTimeLabel = screen.getByText("Occasion");
      expect(chooseTimeLabel).toBeInTheDocument();

      // You can also check if the mock times are rendered as options
      for (const time of mockAvailableTimes) {
        expect(screen.getByText(time)).toBeInTheDocument();
      }


      
  });

  it('renders the customer first name and customer last name', () => {
      // Define a mock array of available times
      const mockAvailableTimes = ['17:00', '18:00', '19:00'];
      const handleSubmit = jest.fn();
      const firstName = 'Jane';
      const lastName = 'Doe';

      render(<BookingForm availableTimes={mockAvailableTimes} firstName={firstName} onSubmit={handleSubmit} />);

      // Fill in all mandatory fields
      fireEvent.change(screen.getByLabelText("Customer first name"), { target: { value: lastName } });
      fireEvent.change(screen.getByLabelText("Customer last name"), { target: { value: lastName } });
  });
});

// describe("Initialize Times", () => {
//   test('Initialize the times for today', () => {
//       const mockInitialTimes = ['17:00', '18:00', '19:00', '20:00', '21:00'];
//       const action = { type: 'SET_TIMES' };
//        render(<BookingPage initializeTimes={mockInitialTimes} />);
      
//       const newState = initializeTimes(action);

//       // Verify that the function returned the expected initial state
//       expect(newState).toEqual(expectedTimes);
      
//   });
// });

describe('initializeTimes', () => {
  // Test for a successful API call
  test('should return times from the API on success', async () => {
    // 1. Arrange: Set up the mock to simulate a successful API response.
    const mockTimes = ['16:00', '17:00', '18:00'];
    mockFetchAPI.mockResolvedValue(mockTimes);

    // 2. Act: Call the function you are testing.
    const result = await initializeTimes();

    // 3. Assert: Verify the result.
    expect(mockFetchAPI).toHaveBeenCalled(); // Check that the API was called.
    expect(result).toEqual(mockTimes);
  });

  // Test for an API call failure
  test('should return initialTimes on API call failure', async () => {
    // 1. Arrange: Set up the mock to simulate an API call failure.
    mockFetchAPI.mockRejectedValue(new Error('API error'));

    // 2. Act: Call the function you are testing.
    const result = await initializeTimes();

    // 3. Assert: Verify the result.
    expect(mockFetchAPI).toHaveBeenCalled();
    // Verify that the fallback data was returned.
    expect(result).toEqual(initialTimes);
  });
});


describe("Update Times", () => {
  test('Update the times with newly provided times', () => {
      // Set up a mock state to pass into the function
      const currentState = ['17:00', '18:00'];
      const action = { type: 'UPDATE_TIMES' };

      // Call the reducer function with the current state and action
      const newState = updateTimes(currentState, action);

      // Assert that the new state is strictly the same as the current state
      expect(newState).toEqual(currentState);
      
  });
});

describe('updateTimes', () => {
  test('should return the same value provided in the state', () => {
    // 1. Arrange: Define a mock state and a mock action.
    const mockState = { times: ['17:00', '17:30', '18:00'] };
    const mockAction = { type: 'UPDATE_TIMES' }; // The action type doesn't matter for this simple version.

    // 2. Act: Call the function with the mock data.
    const result = updateTimes(mockState, mockAction);

    // 3. Assert: Verify that the function returned the correct part of the state.
    // expect(result).toEqual(mockState.times);
    expect(result.times).toEqual(mockState.times);
  });
});
