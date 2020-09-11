import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import "./ReservationInfo.css";

const ReservationInfo = (props) => {
	useEffect(() => {
		props.onResetBooking();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleButtonClick = () => {
		if (props.auth) {
			props.history.push(`${props.match.url}/huts`);
		} else {
			props.history.push("/login");
		}
	};

	return (
		<div className="ReservationInfo my-3 Raised p-3">
			<div className="row">
				<div className="col-12">
					<h3 className="DarkBlue Font4">Before You Book:</h3>
					<p className="Font5">
						Reservations are required to stay at all CVHS
						facilities. To reserve book online a maximum of 2 months
						in advance as is viewable on be online calendar.
						Payments are made online at the time of booking by the
						PayPal system, no exceptions. Custom bookings up to 2
						calendar months+2 calendar weeks in advance are
						available for an additional non-refundable fee of $35.
					</p>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<h4 className="Font4 DarkBlue">When To Book:</h4>
					<p className="Font5">
						You can book online up to 2 calendar months from today.
						Alternatively, bookings an additional 2 weeks in advance
						are available when booking via email. An additional $35
						fee applies per reservation for early access.
					</p>
				</div>
				<div className="col-md-6">
					<h4 className="Font4 DarkBlue">Booking via email:</h4>
					<ol className="Font6 p-2">
						<li>
							New users must register online first via the
							registration page
						</li>
						<li>
							Contact us at lets.toure@gmail.com USING your
							REGISTERED EMAIL address and NAME, no earlier than 2
							calendar months + 2 calendar weeks in advance
							(midnight 12:00:01 Mountain time zone) with;
							-Arrival date no more than 2 calendar months + 2
							calendar weeks in advance. -Hut desired and number
							of nights stay (Jumbo, McMurdo, Dave White & Olive
							Huts – 4 night maximum. Kingsbury – 7 nights)
						</li>
						<li>
							You will receive an email reply if your desired
							dates are not available. Otherwise a confirmation
							email will arrive usually within 24 hours, followed
							shortly by a PayPal invoice. Please pay the invoice
							promptly within a few hours to avoid automatic
							cancellation by the reservation system for
							non-payment. Please monitor your email for the
							invoice and pay promptly to make this workable for
							us!
						</li>
						<li>
							The cancellation policy remains the same; 30 days
							prior to arrival for an 80% refund of the basic fee
							only.
						</li>
						<li>
							Date changes are available up to 1 day prior for an
							additional $35 fee, non-refundable.
						</li>
					</ol>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<h4 className="Font4 DarkBlue">Payment Info:</h4>
					<p className="Font5">
						Payments Our booking website uses PayPal payments only.
						Be sure to select the “Pay Here” button when it appears
						to process your payment, or the booking will cancel in
						24 hours automatically. Your credit or debit card will
						be charged directly.
					</p>
				</div>
				<div className="col-md-6">
					<h4 className="Font4 Red">Cancellation Policy:</h4>
					<p className="Font5">
						Cancellations received by email more than 1 calendar
						month prior to the first night reserved will receive an
						80% refund, no exceptions. Within 1 month no refund is
						applicable. Please give us as much cancellation notice
						as possible as we may be turning others away from the
						hut you have booked. Refunds are processed at the end of
						the season.
					</p>
				</div>
			</div>
			<small className="d-block m-auto text-center">
				Email with questions ONLY after reading all the information on
				this entire website please.
			</small>
			<button
				className="Button DarkBlue-BG Orange mt-3"
				onClick={handleButtonClick}
			>
				{props.auth ? "Continue With Reservation" : "Login"}
			</button>
		</div>
	);
};

const mapDispatchToProps = (dispatch) => {
	return {
		onResetBooking: () => dispatch(actions.resetBooking()),
	};
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth.token !== null,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReservationInfo);
