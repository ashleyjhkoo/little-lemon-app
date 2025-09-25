import './BookingPage.css';
import BookingForm from './BookingForm';

const BookingPage = () => {
    const bookingBgClass = 'bg-container_bookingPage';
    const bookingContentClass = 'content-container_bookingPage';
    const formClass = 'form-container_bookingForm';

    return (
        <main className={bookingBgClass}>
            <section className={bookingContentClass}>
                <h1 id="reservations-title">Reserve a Table</h1>
                <BookingForm className={formClass} />
            </section>
        </main>
    );
};

export default BookingPage; 