import React, { useState, useEffect } from "react";
import DayPicker, { DateUtils } from "react-day-picker";
import Moment from "moment";
import {withRouter} from 'react-router-dom';
import { extendMoment } from "moment-range";
import "react-day-picker/lib/style.css";
import "./ReservationDates.css";
import { connect } from "react-redux";
import * as actions from "../../../store/actions/index";
import ErrorAlert from "../../../components/UI/ErrorAlert/ErrorAlert";
import Modal from '../../../components/UI/Modal/Modal';
import Loader from "../../../components/UI/Loader/Loader";
import { HUT_DATA } from "../../../Data/HUT_DATA";
import ObjectTable from "../../../components/UI/ObjectTable/ObjectTable";
import { Redirect } from "react-router-dom";
const moment = extendMoment(Moment);

const days_between = (date1, date2) => {
	// The number of milliseconds in one day
	const ONE_DAY = 1000 * 60 * 60 * 24;

	// Calculate the difference in milliseconds
	const differenceMs = Math.abs(date1 - date2);

	// Convert back to days and return
	return Math.round(differenceMs / ONE_DAY);
};

const ReservationDates = (props) => {
	const initialRange = { from: undefined, to: undefined };
	const [range, setRange] = useState(initialRange);
	const [error, setError] = useState(null);

	useEffect(() => {
		if(props.admin && props.editing){
			setRange({from: new Date(props.editing.dates[0]), to:new Date(props.editing.dates[props.editing.dates.length-1])})
		}

		props.onFetchAvailableDates(cabin, props.token);
	}, []);

	useEffect(() => {
		if (props.currentBooking) {
			props.history.push(props.match.url + "/book");
		}
	}, [props.currentBooking]);

	const cabin = props.match.params.hut;
	const cabinData = HUT_DATA.find((hut) => hut.dbName == cabin);

	const handleDayClick = (day, { disabled, unavailable, editing }) => {
		setError(null);
		if ((disabled || unavailable) && !editing) {
			setError("The Selected Date is not bookable");
		} else if (range.from && unavailableChecker(range.from, day)) {
			setError("One of more of the selected dates are unavailable");
		} else if (
			range.from &&
			days_between(range.from, day) >
				props.bookedDates[cabin].maxNights - 1
		) {
			setError(
				`The maximum stay length is ${props.bookedDates[cabin].maxNights} days`
			);
		} else {
			const newRange = DateUtils.addDayToRange(day, range);
			setRange(newRange);
		}
	};

	const handleInitiateBooking = () => {

		if(props.editing && props.admin){
			props.onUpdateBooking(range.from, range.to)
		}else{
		props.onInitiateBooking(range.from, range.to, cabin, {
			userId: props.userId,
			token: props.token
		})};
	};

	const unavailableChecker = (date1, date2) => {
		let flag = false;
		const args = [date1, date2];
		const [smallest, largest] = args.sort((a, b) => {
			return Date.parse(a) - Date.parse(b);
		});
		const dates = moment.range(moment(smallest), moment(largest));
		const dateRange = Array.from(dates.by("day"));
		dateRange.forEach((date) => {
			if (flag) {
				return;
			} else {
				flag =
					props.bookedDates[cabin].filledDates.indexOf(
						date.format("ddd MMM DD YYYY")
					) !== -1;
			}
			if(props.editing && flag && props.editing.dates.indexOf(date.format("ddd MMM DD YYYY") === -1)){
				flag = false;
			}
		});
		return flag;
	};

	const handleResetClick = () => {
		setRange(initialRange);
	};

	let bookedDates = [];
	let endOfDateRange = new Date();
	endOfDateRange.setMonth(endOfDateRange.getMonth() + 2);
	const disabledDates = new Date(endOfDateRange);
	let editingDates = [""];

	if(props.admin && props.editing){
		const editingRange = moment.range(props.editing.dates[0], props.editing.dates[props.editing.dates.length-1])
		editingDates = Array.from(editingRange.by("day")).map(date=> new Date(date));
	}
	const availableRange = moment.range(new Date(), endOfDateRange);
	const availableDates = Array.from(availableRange.by("day"))
		.filter((date) => {
			if (
				props.bookedDates[cabin].filledDates &&
				props.bookedDates[cabin].filledDates.indexOf(
					date.format("ddd MMM DD YYYY")
				) === -1
			) {
				return true;
			} else {
				return false;
			}
		})
		.map((date) => new Date(date));

	if (props.bookedDates[cabin].filledDates) {
		bookedDates = props.bookedDates[cabin].filledDates.map((date) => {
			return new Date(date);
		});

		if (
			range.from &&
			!range.to &&
			disabledDates.getDate() - range.from.getDate() <
				props.bookedDates[cabin].maxNights &&
			disabledDates.getMonth() === range.from.getMonth()
		) {
			const difference =
				range.from.getDate() -
				disabledDates.getDate() +
				props.bookedDates[cabin].maxNights -
				1;
			disabledDates.setDate(disabledDates.getDate() + difference);
		}
	}
	const { from, to } = range;

	const priceBreakDown = (from,to) => {
		const quantity = days_between(from, to)+1;
		let acc=0;
		let prices = [];
		let jsxObj = {};
		console.log(cabinData);

		if(cabinData.price.length>1){prices = cabinData.price}
			else{ 
				for(let j=1; j<=quantity; j++){
					prices.push(cabinData.price[0])
				}
			}
			console.log(prices)
		for(let i=1; i<=quantity; i++){
			jsxObj[`Day ${i}`] = "$"+prices[i-1]
			acc+= +prices[i-1];
			console.log(jsxObj)
		}
		jsxObj["+13% Tax"] = "$"+(+acc*0.13).toFixed(2);
		
		jsxObj.Total = "$" + (acc+(acc*0.13)).toFixed(2)
		return (<div className="border"><h5 className="DarkBlue Font4 my-3">Price Breakdown</h5><div className="Raised px-5 py-3 mb-3" style={{width:"300px", margin:"auto"}}><ObjectTable price object={jsxObj}/></div></div>);

	}

	let total = null;
	if(range.from && range.to){total=priceBreakDown(range.from,range.to)};

	return (
		<div className="ReservationDates">
			<h3>
				Date and Duration:{" "}
				<span className="BrightBlue">{cabinData.name}</span>{" "}
			</h3>
			{props.loading ? (
				<Loader />
			) : props.fetchError ? (
				<Modal small error closeModal={()=>{props.onClearError("fetchError");
			props.history.push('/account-info')}}>
				<ErrorAlert
					error={props.fetchError }
				/>
				</Modal>
			) : (
				<React.Fragment>
					<small className="DarkBlue d-block">
						<span className="Bungee mr-1" style={{color:"hsl(8.3,88.6%,50.4%)"}}>Note: </span>
						{"  "} You will checkout the day{" "}
						<span style={{color:"hsl(8.3,88.6%,50.4%)"}}>AFTER</span> your final selected
						date
					</small>
					<DayPicker
						className="Selectable"
						onDayClick={handleDayClick}
						numberOfMonths={2}
						selectedDays={[from, { from, to }]}
						modifiers={{
							disabled: {
								after: disabledDates,
								before: new Date(),
							},
							start: range.from,
							end: range.to,
							unavailable: bookedDates,
							available: availableDates,
							editing: editingDates
						}}
						modifiersStyles={modifiersStyles}
					/>

					<div className="px-5 pt-3">
						{error ? (
							<Modal error small closeModal={() => {
									setError(null)}}>
							<ErrorAlert
								error={{ message: error }}								
							/>
							</Modal>
						) : null}
						<div className="Info Grey-BG py-3" style={{maxHeight:range.from && range.to ? "700px" : "100px"}}>
							{!range.from && !range.to && (
								<p className="Font4 m-0 p-0 Blue Bungee TextOutline">
									Please select the first day.
								</p>
							)}
							{range.from && !range.to && (
								<p className="Font4 m-0 p-0 Blue Bungee TextOutline">
									Please select the last day.
								</p>
							)}
							{range.from && range.to && (
								<React.Fragment>
									<h5 className="Font4 DarkBlue">
										Selected Dates
									</h5>{" "}
									<p>
										Arrival:{" "}
										<span className="BrightBlue Font4">
											{range.from.toLocaleDateString()}
										</span>
									</p>
									<p>
										{" "}
										Checkout:{" "}
										<span className="BrightBlue Font4">
											{new Date(
												Date.parse(range.to) +
													60000 * 60 * 24
											).toLocaleDateString()}
										</span>
									</p>
								{total}
								</React.Fragment>
							)}
							{range.from && range.to && (
								<React.Fragment>
									<button
										className=" m-2 Red Bungee Red-BG Font5 px-4 TextOutline Raised"
										onClick={handleResetClick}
									>
										Reset
									</button>
									<button
										disabled={props.disabled}
										className="m-2 BrightOrange Bungee DarkBlue-BG Font5 px-4 Raised"
										onClick={handleInitiateBooking}
									>
										{props.editing && props.admin ? "Update" : "Book" }
									</button>
								</React.Fragment>
							)}
						</div>
					</div>
				</React.Fragment>
			)}
			{props.selectError ? (
				<Modal error small closeModal={()=>props.onClearError('selectError')}>
				<ErrorAlert
					error={props.selectError}
				/>
				</Modal>
			) : null}
		</div>
	);
};

const modifiersStyles = {
	unavailable: { color: "hsl(8.3,88.6%,50.4%)" },
	available: { color: "hsl(128.3,48.9%,50.4%)" },
	editing: {color:"yellow"}
};

const mapStateToProps = (state) => {
	return {
		bookedDates: state.reservations.cabinData,
		loading: state.reservations.loading,
		fetchError: state.reservations.fetchError,
		selectError: state.reservations.selectError,
		currentBooking: state.reservations.booking.bookingStart,
		token: state.auth.token,
		userId: state.auth.userData._id,
		verified:state.auth.userData.active
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchAvailableDates: (hutName, token) =>
			dispatch(actions.fetchAvailability(hutName, token)),
		onInitiateBooking: (date1, date2, hut, userData) =>
			dispatch(actions.initiateBooking(date1, date2, hut, userData)),
		onClearError:(err) => dispatch(actions.clearError(err))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReservationDates));
