import React from 'react';
import {connect} from 'react-redux';
import {addDays} from '../../../Utility Functions/DateFunctions';
import ObjectTable from '../../UI/ObjectTable/ObjectTable';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Search Result.css';

const SearchResult = (props) => {
	
	const checkout = addDays(props.booking.dates[props.booking.dates.length-1], 1)

	return (<li className="SearchResult Raised p-3">
		<div className="d-flex justify-content-end mb-3">
		<span onClick={props.editClicked}>
		<FontAwesomeIcon
							icon={faPencilAlt}
							className="Green text-right mr-5"
							size="1x"
						/>
		</span>
		<span onClick={props.deleteClicked}>
		<FontAwesomeIcon
							icon={faTrashAlt}
							className="Red text-right mr-5"
							size="1x"
						/>
		</span>
		</div>
	<h4 className="DarkBlue Font4">Reservation ID: {props.booking._id}</h4>
	
	<ObjectTable object={{
		Cabin: props.booking.hut,
		"Check In": new Date(props.booking.dates[0]).toLocaleDateString(),
		"Check Out": new Date(checkout).toLocaleDateString(),
		Name:props.booking.userData.name,
		Email:props.booking.userData.email,
		Mobile:props.booking.userData.mobile,

	}}
	/>
</li>)
};

export default SearchResult ;