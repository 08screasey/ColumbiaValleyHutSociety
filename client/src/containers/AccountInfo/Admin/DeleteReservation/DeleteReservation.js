import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import * as actions from '../../../../store/actions/index';
import { faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '../../../../components/UI/Modal/Modal';
import Loader from '../../../../components/UI/Loader/Loader';
import {addDays} from '../../../../Utility Functions/DateFunctions';
import './DeleteReservation.css';

const DeleteReservation = (props) => {
	
	const findOne = (id) => {
		return props.queryResults.filter((result) => result._id === id)[0]
	}

	const [bookingToDelete] = useState(findOne(props.match.params.id))

	if(!bookingToDelete){
		return <Redirect to="/" />
	}

	const checkout = addDays(bookingToDelete.dates[bookingToDelete.dates.length-1], 1);



	return (<div className="DeleteReservation">
		{props.deleted ? <Modal success small closeModal={()=>{props.onClearQueryStatus(); 
			props.history.push('/admin')}}>
				<div className="text-center">
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="Green m-auto"
							size="4x"
						/>
						<p className="mx-auto my-3">
							Booking successfully cancelled
						</p>
					</div>
		</Modal> :  null}{props.loading ? <Loader /> : <React.Fragment>
	<p>Are you sure you want to cancel this reservation? Cancelling will trigger an automatic refund of {'$' + (parseFloat(bookingToDelete.price)*0.8).toFixed(2)} to the account of {bookingToDelete.userData.email}.</p>
	<div className="Raised p-3">
	<p>Cabin: {bookingToDelete.hut}</p>
	
	<p>Check In: {new Date(bookingToDelete.dates[0]).toLocaleDateString()}</p>
	<p>Check Out: {new Date(checkout).toLocaleDateString()}</p>

	<p>Name: {bookingToDelete.userData.name}</p>
	<p>Email: {bookingToDelete.userData.email}</p>
	<p>Mobile: {bookingToDelete.userData.mobile}</p>
	</div>
	<button className="Button Red-BG Red Bungee" onClick={()=>props.onDeleteReservation(bookingToDelete._id, props.token)}>Yes, cancel this reservation</button>
	<button className="Button Grey-BG DarkBlue Bungee" onClick={()=>props.history.push("/admin")}>No, go back</button>
</React.Fragment>}
	</div>)
};

const mapStateToProps = state => {
	return {queryResults:state.reservations.queryResults,
		token:state.auth.token,
		deleted:state.reservations.queryStatus === "Deleted",
		loading:state.reservations.loading}
};

const mapDispatchToProps = dispatch => {
	return {
		onDeleteReservation: (id, token)=>dispatch(actions.deleteReservation(id, token)),
		onClearQueryStatus: () => dispatch(actions.clearQueryStatus())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteReservation)