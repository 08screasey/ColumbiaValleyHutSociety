import React from 'react';
import { addDays } from '../../../Utility Functions/DateFunctions';
const BookingReview = (props) => {
    return (
        <div className="BookingReview p-3 Grey-BG">
            <h3 className="text-center Font2 Green my-2">
                {props.editing ? 'Booking Overview' : 'Booking Confirmed!'}
            </h3>

            <p className="mb-4">An overview of your booking is detailed below.</p>
            <p className="m-1">
                <span className="Blue">Reference:</span>
                {props.bookingDetails._id}
            </p>
            <p className="m-1">
                <span className="Blue">Name:</span> {props.bookingDetails.userData.name}
            </p>
            <p className="m-1">
                <span className="Blue">Email Address:</span> {props.bookingDetails.userData.email}
            </p>

            <p className="m-1">
                <span className="Blue">Check In Date:</span>{' '}
                {new Date(props.bookingDetails.dates[0]).toLocaleDateString()}
            </p>
            <p className="mb-4">
                <span className="Blue">Check Out Date:</span>{' '}
                {addDays(props.bookingDetails.dates[props.bookingDetails.dates.length - 1], 1)}
            </p>

            <p className="Font6 DarkBlue">
                {props.editing
                    ? 'Please not that submitting this booking will incur the charge to the email address listed. The total price will be calculated accordingly to the previous booked dates + a $35 date change fee'
                    : 'If you wish to make any changes to your booking please contact us via mobile. Cancellations can be made 7 days prior to arrival and can be completed from your account overview. Check in time is 2pm and check out is 11am. Please leave the space clean for the next arrivals.'}
            </p>
        </div>
    );
};

export default BookingReview;
