import axios from "axios";
import * as actions from "./actionTypes";

export const fetchAvailability = (hutName, token) => {
	return (dispatch) => {
		dispatch(fetchAvailabilityStart());
		axios
			.get(`/api/huts/${hutName}`, {
				headers: {
					"x-auth-token": token,
				},
			})
			.then((res) => {
				dispatch(fetchAvailabilitySuccess(res.data));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(fetchAvailabilityFail(error));
			});
	};
};

const fetchAvailabilityStart = () => {
	return { type: actions.FETCH_AVAILABILITY_START };
};

const fetchAvailabilitySuccess = (res) => {
	return {
		type: actions.FETCH_AVAILABILITY_SUCCESS,
		payload: {
			cabinData: res,
		},
	};
};

const fetchAvailabilityFail = (err) => {
	return { type: actions.FETCH_AVAILABILITY_FAIL, payload: { error: err } };
};

export const initiateBooking = (date1, date2, hut, userData) => {
	return (dispatch) => {
		dispatch(initiateBookingStart());
		axios
			.post(
				"/api/bookings/" + hut,
				{ date1: date1, date2: date2, userId: userData.userId },
				{ headers: { "x-auth-token": userData.token } }
			)
			.then((res) => {
				dispatch(initiateBookingSuccess(res.data));
				dispatch(resetBookingTimeout());
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(initiateBookingFail(error));
			});
	};
};

const resetBookingTimeout = () => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(resetBooking());
		}, 900000);
	};
};

export const resetBooking = () => {
	return { type: actions.RESET_BOOKING };
};

export const initiatePayment = (user, dates, hut) => {
	
}

const initiateBookingStart = () => {
	return { type: actions.INITIATE_BOOKING_START };
};

const initiateBookingSuccess = (booking) => {
	return {
		type: actions.INITIATE_BOOKING_SUCCESS,
		payload: {
			hut: booking.name,
			dates: booking.dates,
			price: booking.price,
			paypalLink:booking.paypalLink
		},
	};
};

const initiateBookingFail = (err) => {
	return { type: actions.INITIATE_BOOKING_FAIL, payload: { error: err } };
};

export const finaliseBooking = (userData, dates, hut, token, paymentInfo) => {
	return (dispatch) => {
		dispatch(finaliseBookingStart());
		axios
			.post(
				"/api/bookings/" + hut + "/book",
				{ dates: dates, userData: userData, paymentInfo:paymentInfo },
				{ headers: { "x-auth-token": token } }
			)
			.then((res) => {
				dispatch(finaliseBookingSuccess(res.data.booking));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(finaliseBookingFail(error));
			});
	};
};

const finaliseBookingStart = () => {
	return { type: actions.FINALISE_BOOKING_START };
};

const finaliseBookingSuccess = (res) => {
	return { type: actions.FINALISE_BOOKING_SUCCESS, payload: { ...res } };
};

const finaliseBookingFail = (err) => {
	return { type: actions.FINALISE_BOOKING_FAIL, payload: { error: err } };
};

export const clearError = (errorType) => {
	return {
		type: actions.CLEAR_ERROR, payload: {
			errorType
		}
	}
}

export const bookingSearch = (type, query, token) => {
	return dispatch => {
		dispatch(bookingSearchStart());
		axios.post("/api/bookings/search", {type:type, query:query}, { headers: { "x-auth-token": token } })
		.then((res)=>{
			dispatch(bookingSearchSuccess(res.data))
		})
		.catch((err)=>{
			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
			dispatch(bookingSearchFail(err))
		})
	}
}

const bookingSearchStart = () => {
	return {type:actions.BOOKING_SEARCH_START}
};

const bookingSearchFail = (err) => {
	return {type:actions.BOOKING_SEARCH_FAIL, payload:{error:err}}
};

const bookingSearchSuccess = (results) => {
	return {type:actions.BOOKING_SEARCH_SUCCESS, payload:{results:results}}
}

export const deleteReservation = (id, token) => {
	return dispatch => {
		dispatch(deleteSearchStart());
		axios.delete("/api/bookings/search/"+id, {headers: {"x-auth-token": token}})
		.then(res=>{
			dispatch(deleteSearchSuccess())
		})
		.catch(err=>{			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
			dispatch(deleteSearchFail(err))
		})
	}
}

const deleteSearchStart = () => {
	return {type:actions.DELETE_SEARCH_START}
}
const deleteSearchFail = (err) => {
	return {type:actions.DELETE_SEARCH_FAIL, payload:{error:err}}
}
const deleteSearchSuccess = () => {
	return {type:actions.DELETE_SEARCH_SUCCESS}
}

export const editReservation = (id, data, token) => {
	return dispatch => {
		dispatch(editSearchStart());
		axios.put('/api/bookings/search/'+ id + '/edit', data, {headers:{"x-auth-token":token}})
		.then(res=>{
			dispatch(editSearchSuccess())})
		.catch(err=>{
			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
			dispatch(editSearchFail(err))
		})	}
}

const editSearchStart = () => {
	return {type: actions.EDIT_SEARCH_START}
};

const editSearchSuccess = () => {
	return {type:actions.EDIT_SEARCH_SUCCESS}
};

const editSearchFail = (err) => {
	return {type:actions.EDIT_SEARCH_FAIL, payload:{error:err}}
}


export const clearQueryStatus = () => {
	return {type:actions.CLEAR_QUERY_STATUS}
}