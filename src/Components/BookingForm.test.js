// Place the jest.mock call at the very top of the file, before any imports.
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useId: () => 'mocked-id',
}));

import * as React from 'react';
import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BookingForm from './BookingForm';

describe('BookingForm HTML5 Validation Test', () => {

  beforeEach(() => {
    // Spy on the useId hook and log its return value
    // This spy will now be on the *mocked* useId, not the original.
    jest.spyOn(React, 'useId').mockImplementation(() => {
      const mockedId = 'mocked-id';
      console.log('Mocked useId returns:', mockedId);
      return mockedId;
    });
  });

  afterEach(() => {
    // Restore the original useId hook after each test
    jest.restoreAllMocks();
  });

  it('should apply HTML5 validation attributes to the occasion input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    const occasionInput = screen.getByLabelText(/Occasion/i);
    // Select an option
    userEvent.selectOptions(occasionInput, 'Birthday');

    // Now the select element should be valid
    expect(occasionInput).toBeValid();
    expect(occasionInput).toHaveAttribute('name', 'occasion');
  });

  it('should apply HTML5 validation attributes to the resDate input', async () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

    // Mock the date to ensure a consistent test environment.
    // This prevents the test from failing when run on different days.
    const mockDate = new Date(2025, 10, 18); // Use a fixed date: October 17, 2025
    jest.useFakeTimers();
    jest.setSystemTime(mockDate); // Set the mocked system time.

    // Format the mock date into a 'yyyy-mm-dd' string.
    const mockMinDateString = mockDate.toISOString().slice(0, 10);
    
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
            minDate={mockMinDateString}
          />
        </MemoryRouter>
    );
    const resDateInput = await screen.getByLabelText(/Reservation date/i);

    // Assert that the 'min' attribute is the fixed date string
    expect(resDateInput).toHaveAttribute('min', mockMinDateString);

    // Restore the real timers after the test is complete
    jest.useRealTimers();
  });

  it('should apply HTML5 validation attributes to the resTime input', async () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    // Test the element's role and value to be matched
    const resTimeInput = screen.getByLabelText(/Reservation time/i);
    const resTimeRole = screen.getByRole('combobox', { name: /Reservation time/i });
    expect(resTimeRole).toBeInTheDocument();
    expect(resTimeInput).toBeInTheDocument();
  });

  it('should apply HTML5 validation attributes to the guests input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    const guestsInput = screen.getByLabelText(/guests/i);
    expect(guestsInput).toHaveAttribute('type', 'number');
  });

  it('should apply HTML5 validation attributes to the firstName input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    const firstNameInput = screen.getByLabelText(/Customer first name/i);
    expect(firstNameInput).toHaveAttribute('id', 'mocked-id-first-name');
  });

  it('should apply HTML5 validation attributes to the lastName input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    const lastNameInput = screen.getByLabelText(/Customer last name/i);
    expect(lastNameInput).toHaveAttribute('id', 'mocked-id-last-name');
  });

  it('should apply HTML5 validation attributes to the contactMethod input', async () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );
    const user = userEvent.setup();

    // Find the fieldset by its "group" role and the legend's text as the name
    const contactMethodFieldset = screen.getByRole('group', { name: /Contact method/i });

    // Use the `within` utility to scope the next query to that fieldset
    const phoneOption = within(contactMethodFieldset).getByLabelText('Phone');
    const emailOption = within(contactMethodFieldset).getByLabelText('Email');

    // Assuming 'Phone' is the default selection
    await expect(screen.getByRole('radio', { name: /Phone/i })).toBeChecked();
    await expect(screen.getByRole('radio', { name: /Email/i })).not.toBeChecked();

    // Simulate user clicking the 'Email' option
    await user.click(emailOption);
    await expect(emailOption).toBeChecked();
    await expect(phoneOption).not.toBeChecked();

    // Simulate user clicking the 'Phone' option again
    await user.click(phoneOption);
    await expect(phoneOption).toBeChecked();
    await expect(emailOption).not.toBeChecked();
  });

  it('should apply HTML5 validation attributes to the phoneNumber input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );

    const phoneNumberInput = screen.getByRole('textbox', { name: /Phone/i });
    expect(phoneNumberInput).toHaveAttribute('type', 'tel');
  });

  it('should apply HTML5 validation attributes to the emailAddress input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );

    const emailAddressInput = screen.getByRole('textbox', { name: /Email/i });
    expect(emailAddressInput).toHaveAttribute('type', 'email');
  });

  it('should apply HTML5 validation attributes to the comments input', () => {
    const handleSubmit = jest.fn();
    const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    render(
        <MemoryRouter>
          <BookingForm 
            onSubmit={handleSubmit} 
            availableTimes={mockAvailableTimes} 
          />
        </MemoryRouter>
    );

    // Find the textarea by its role and accessible name
    // Method 1
    const commentsInput = screen.getByLabelText(/Comments/i);
    expect(commentsInput.tagName).toBe('TEXTAREA');
 
    // Method 2
    // const commentInputByRole = screen.getByRole('textbox', { name: /Comments/i });
    // expect(commentInputByRole.tagName).toBe('TEXTAREA');

  });

});

describe('BookingForm Validation Functions Test', () => {
  const mockHandleSubmit = jest.fn();
  const mockHandleChange = jest.fn();
  const mockHandleDateChange = jest.fn();
  const mockAvailableTimes = ['17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

  const defaultProps = {
    className: 'booking-form',
    bookingFormId: 'test-booking-form',
    formData: { occasion: 'Birthday' },
    resDate: '2025-12-25', // Example date
    contactMethod: 'phone',
    handleSubmit: mockHandleSubmit,
    handleChange: mockHandleChange,
    handleDateChange: mockHandleDateChange,
  };

  beforeEach(() => {
    // Clear mock calls before each test
    mockHandleSubmit.mockClear();
    mockHandleChange.mockClear();
    mockHandleDateChange.mockClear();
  });

  it('valid state test', async () => {
    const user = userEvent.setup();

    render(
    <MemoryRouter>
      <BookingForm 
        {...defaultProps} 
        availableTimes={mockAvailableTimes} 
      />
    </MemoryRouter>
    );

    // Simulate user changing the reservation date
    const resDateInput = screen.getByLabelText(/Reservation date/i);
    await fireEvent.change(resDateInput, { target: { value: '2026-01-01' } });
    expect(mockHandleDateChange).toHaveBeenCalledTimes(1);

    // Simulate user clicking the email radio button
    const emailRadioButton = screen.getByRole('radio', { name: /email/i });
    await userEvent.click(emailRadioButton);
    expect(emailRadioButton).toBeChecked(); // Assert the radio is now selected

    // Simulate the form submission with empty required field
    // const firstNameInput = screen.getByLabelText(/Customer first name/i);
    // await userEvent.clear(firstNameInput);
    // // Act
    // await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));
    // const form = screen.getByRole('form', { name: 'my booking form' });
    // // Assert
    // expect(mockHandleSubmit).not.toHaveBeenCalled();
    // // Optional: Assert that an error message is displayed
    // expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
  });

  it('invalid state test',async () => {
    const user = userEvent.setup();

    render(
    <MemoryRouter>
      <BookingForm 
        {...defaultProps} 
        availableTimes={mockAvailableTimes} 
        onSubmit={mockHandleSubmit}
      />
    </MemoryRouter>
    );

    // Simulate invalid phone input
    const phoneNumberInput = screen.getByRole('textbox', { name: /Phone/i });
    await userEvent.type(phoneNumberInput, '123');
    // Simulate the user blurring the field to trigger validation
    // (Alternatively, you could find and click the submit button)
    await userEvent.tab();
    // Wait for the asynchronous validation to finish and the error message to appear
    await waitFor(() => {
    // Assert that the error message is now present in the document
    expect(screen.getByText('Phone number is invalid')).toBeInTheDocument();
    });

    // Simulate the form submission with empty required field
    const firstNameInput = screen.getByLabelText(/Customer first name/i);
    await userEvent.clear(firstNameInput);
    // Act
    await userEvent.click(screen.getByRole('button', { name: /Confirm reservation/i }));
    const form = screen.getByRole('form', { name: 'my booking form' });
    // Assert
    expect(mockHandleSubmit).not.toHaveBeenCalled();
    // Optional: Assert that an error message is displayed
    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
  });
});