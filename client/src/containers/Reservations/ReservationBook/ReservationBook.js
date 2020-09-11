import React, { useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Timer from "../../../components/UI/Timer/Timer";
import { HUT_DATA } from "../../../Data/HUT_DATA";
import * as actions from "../../../store/actions/index";
import formChecker from '../../../Utility Functions/Form Check';
import validityChecker from '../../../Utility Functions/Validity Checker';
import Modal from '../../../components/UI/Modal/Modal';
import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import Loader from '../../../components/UI/Loader/Loader';
import BookingReview from '../../../components/Reservations/BookingReview/BookingReview';
import ObjectTable from '../../../components/UI/ObjectTable/ObjectTable';

const ReservationBook = (props) => {

	//Form input methods
	const [form, setForm] = useState({
				name: {
					value: `${props.userData.firstName} ${props.userData.lastName}`,
					valid: true,
					touched: false,
					validity: { required: true, name: true },
				},
				email: {
					value: props.userData.email,
					valid: true,
					touched: false,
					validity: { required: true, email: true },
				},
				phone: {
					value: props.userData.phone,
					valid:true,
					touched:false,
					validity: {required:true, phone:true}
				}
	});

	const [validForm, setValidForm] = useState(true);

	
const handleInputChange = (e, identifier) => {
		const newForm = { ...form };
		newForm[identifier].value = e.target.value;
		newForm[identifier].touched = true;
		newForm[identifier].valid = validityChecker(
			newForm[identifier].validity,
			newForm[identifier]
		);
		setForm(newForm);
		setValidForm(formChecker(form))
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		localStorage.setItem("name", form.name.value);
		localStorage.setItem("email", form.email.value);
		localStorage.setItem("mobile", form.phone.value);
		localStorage.setItem("dates", props.booking.dates);
		localStorage.setItem("hut", props.booking.hut);
		window.location.href = props.paypalLink
	/*	props.onFinaliseBooking(
			{ name:form.name.value, email:form.email.value, mobile:form.phone.value, userId: props.userData._id },
			props.booking.dates,
			props.booking.hut,
			props.token
		);*/
	};

	//To prevent errors, if there is no stored bookingStart, redirect to /reservations
	
	let content = <Redirect to="/reservations" />;

	if (!!props.booking.bookingStart) {
		let cabin = HUT_DATA.find((hut) => {
			return hut.dbName === props.booking.hut;
		});

		content = (
			<div className="ReservationBook">
				<Timer time={props.booking.expiresIn} />
				<h3 className="Font4 DarkBlue mt-4">Booking Details</h3>
				<div className="Breakdown px-5">
			<ObjectTable object={{Cabin: cabin.name, Arrival: props.booking.dates[0], Checkout:new Date(
								Date.parse(
									props.booking.dates[
										props.booking.dates.length - 1
									]
								) +
									60000 * 60 * 24
							).toDateString(), Total: "$"+props.booking.price}}/>
				{/*	<p className="d-flex justify-content-around">
						Cabin: <span className="BrightBlue">{cabin.name}</span>
					</p>
					<p className="d-flex justify-content-around">
						Arrival:{" "}
						<span className="BrightBlue">{props.booking.dates[0]}</span>
					</p>
					<p className="d-flex justify-content-around">
						Checkout:{" "}
						<span className="BrightBlue">
							{new Date(
								Date.parse(
									props.booking.dates[
										props.booking.dates.length - 1
									]
								) +
									60000 * 60 * 24
							).toDateString()}
						</span>
					</p>
					<p className="d-flex justify-content-around">
						Price: <span className="BrightBlue">${props.booking.price}</span>
					</p>*/}
					<h3 className="DarkBlue Font5">
						Please Fill Out The Fields Below
					</h3>
					<form onSubmit={handleSubmit}>
						<div className="FormGroup">
							<label>Name:</label>
							<input
								type="text"
								onChange={(e) => handleInputChange(e, "name")}
								value={form.name.value}
								placeholder={"Name"}
								required
								className={
											form.name.touched &&
											!form.name.valid
												? "FormControl Invalid"
												: "FormControl"
										}
							/>{form.name.touched &&
									!form.name.valid ? (
										<p className="Red d-block text-center m-auto Font6">
											Please enter your name
										</p>
									) : null}
						</div>
						<div className="FormGroup">
							<label>Email:</label>
							<input
								type="text"
								onChange={(e) => handleInputChange(e, "email")}
								value={form.email.value}
								placeholder={"Email"}
								required
								className={
											form.email.touched &&
											!form.email.valid
												? "FormControl Invalid"
												: "FormControl"
										}
							/>{form.email.touched &&
									!form.email.valid ? (
										<p className="Red d-block text-center m-auto Font6">
											Please enter a valid email
										</p>
									) : null}
						</div>
						<div className="FormGroup">
							<label>Phone:</label>
							<input
								type="text"
								onChange={(e) => handleInputChange(e, "phone")}
								value={form.phone.value}
								placeholder={"Phone Number"}
								required
								className={
											form.phone.touched &&
											!form.phone.valid
												? "FormControl Invalid"
												: "FormControl"
										}
							/>{form.phone.touched &&
									!form.phone.valid ? (
										<p className="Red d-block text-center m-auto Font6">
											Please enter a valid mobile number
										</p>
									) : null}
						</div>
						<button className="Button BrightBlue Grey-BG Bungee my-3" disabled={!validForm}>
							Checkout with Paypal
						</button>
					</form>
				</div>
				{props.completedReservation ? (<Modal big success closeModal={()=>{props.onUpdateUserData(props.completedReservation, 'reservations'); props.onResetBooking()}}>
						<BookingReview bookingDetails={props.completedReservation} clicked={()=>props.onResetBooking()}/>
						</Modal>) :
						props.error ? (<Modal small error closeModal={()=>props.onClearError('fetchError')}>
						<ErrorAlert error={props.error} />
						</Modal>) : 
						props.loading ? 
						(<Modal small>
						<Loader />
						</Modal>) : null}
			</div>
		);
	}

	return content;
};

const mapStateToProps = (state) => {
	return {
		loading:state.reservations.loading,
		booking: state.reservations.booking,
		userData: state.auth.userData,
		token: state.auth.token,
		completedReservation:state.reservations.completedReservation,
		error:state.reservations.fetchError,
		paypalLink:state.reservations.paypalLink
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFinaliseBooking: (formData, dates, hut, token) =>
			dispatch(actions.finaliseBooking(formData, dates, hut, token)),
		onResetBooking: () => dispatch(actions.resetBooking()),
		onUpdateUserData: (data, locator) => dispatch(actions.updateUserData(data, locator)),
		onClearError:(error)=>dispatch(actions.clearError(error)),
		onInitPayment:(user, dates, hut)=>dispatch(actions.initiatePayment(user, dates, hut))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReservationBook);
