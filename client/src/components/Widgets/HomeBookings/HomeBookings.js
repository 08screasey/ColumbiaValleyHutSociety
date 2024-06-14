import React from 'react';
import { withRouter } from 'react-router-dom';

const HomeBookings = (props) => {
    return (
        <div>
            <h2 className="DarkBlue TextOutline Font1">Bookings & Enquiries</h2>
            <p className="DarkBlue">
                Online Reservations are available up to
                <strong> 2 Months </strong>
                before arrival, with an additional
                <strong> 2 weeks </strong>
                available for an extra fee
                <strong> ($35) </strong>.
            </p>
            <button
                className="Orange DarkBlue-BG Button Font4"
                onClick={() => {
                    props.history.push('/reservations');
                }}
            >
                Make a Reservation
            </button>
        </div>
    );
};

export default withRouter(HomeBookings);
