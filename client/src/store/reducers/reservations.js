import * as actions from "../actions/actionTypes";

const initialState = {
	cabinData: {
		"jumbo": {},
		"olive": {},
		"mcmurdo": {},
		"kingsbury": {},
		"david-white": {},
	},
	loading: false,
	fetchError: null,
	selectError: null,
	booking: {
		hut: null,
		bookingStart: null,
		dates: null,
		expiresIn: null,
		price: null,
	},
	completedReservation: null,
	queryResults:[],
	queryStatus:null,
	paypalLink:null
};

const fetchAvailabilitySuccess = (state, action) => {
	const cabinData = { ...state.cabinData };
	cabinData[action.payload.cabinData.name] = action.payload.cabinData;
	return { ...state, cabinData: cabinData, loading: false };
};

const clearError  = (state, action) => {
	const newState = {...state}
	newState[action.payload.errorType] = null;
	return newState;
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.FETCH_AVAILABILITY_START:
			return {
				...state,
				fetchError: null,
				loading: true,
				selectError: null,
				booking: {
					hut: null,
					bookingStart: null,
					dates: null,
					expiresIn: null,
					price: null,
				},
				completedReservation:null,
				paypalLink:null
			};
		case actions.FETCH_AVAILABILITY_SUCCESS:
			return fetchAvailabilitySuccess(state, action);
		case actions.FETCH_AVAILABILITY_FAIL:
			return {
				...state,
				fetchError: action.payload.error,
				loading: false,
			};
		case actions.INITIATE_BOOKING_START:
			return { ...state, selectError: null, loading: true, paypalLink:null };
		case actions.INITIATE_BOOKING_SUCCESS:
			const booking = {
				hut: action.payload.hut,
				bookingStart: true,
				dates: action.payload.dates,
				expiresIn: +new Date(+new Date() + 900000),
				price: action.payload.price,
			};
			return {
				...state,
				selectError: null,
				loading: false,
				booking: booking,
				completedReservation:null,
				paypalLink:action.payload.paypalLink
			};
		case actions.INITIATE_BOOKING_FAIL:
			return {
				...state,
				selectError: action.payload.error,
				loading: false,
			};
		case actions.RESET_BOOKING:
			return {
				...state,
				booking: {
					hut: null,
					bookingStart: null,
					dates: null,
					price: null,
				},
				completedReservation:null
			};
		case actions.FINALISE_BOOKING_START:
			return { ...state, error: null, loading: true };
		case actions.FINALISE_BOOKING_SUCCESS:
			return {
				...state,
				completedReservation: action.payload,
				loading: false,
			};
		case actions.FINALISE_BOOKING_FAIL:
			return { ...state, fetchError: action.payload.error, loading: false };
		case actions.BOOKING_SEARCH_START:
			return {...state, loading:true, fetchError:null, queryResults:[], queryStatus:null};
		case actions.BOOKING_SEARCH_FAIL:
		 	return {...state, loading:false, fetchError:action.payload.error};
		 case actions.BOOKING_SEARCH_SUCCESS:
		 	return {...state, loading:false, queryResults:action.payload.results};
		 case actions.DELETE_SEARCH_START:
		 	return {...state, loading:true, selectError:null};
		 case actions.DELETE_SEARCH_SUCCESS:
		 	return {...state, loading:false, queryStatus:"Deleted"};
		 case actions.DELETE_SEARCH_FAIL:
		 	return {...state, loading:false, selectError:action.payload.error};
		 case actions.CLEAR_QUERY_STATUS:
		 	return {...state, queryStatus:null, queryResults:[]};
		 case actions.EDIT_SEARCH_START:
		 	return {...state, loading:true, selectError:null};
		 case actions.EDIT_SEARCH_SUCCESS:
		 	return {...state, loading:false, queryStatus:"Editing"};
		 case actions.EDIT_SEARCH_FAIL:
		 	return {...state, loading:false, selectError:action.payload.error}
		case actions.CLEAR_ERROR:
			return clearError(state, action);
		default:
			return state;
	}
};

export default reducer;
