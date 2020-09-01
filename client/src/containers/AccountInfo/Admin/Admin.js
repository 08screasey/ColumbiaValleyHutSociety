import React, {useState} from "react";
import { connect } from "react-redux";
import {Route, Switch} from 'react-router-dom';
import * as actions from '../../../store/actions/index';
import AdminUsers from './AdminUsers/AdminUsers';
import EditReservation from './EditReservation/EditReservation';
import DeleteReservation from './DeleteReservation/DeleteReservation';
import SearchResult from '../../../components/Admin/Search Result/Search Result';
import Loader from '../../../components/UI/Loader/Loader';
import './Admin.css';

const Admin = (props) => {

	const [search, setSearch] = useState({
		type:{
			value:"_id",
		},
		search:{
			value:""
		}
	});

	const handleInputChange = (e, identifier) => {
		const newSearch = {...search};
		newSearch[identifier].value = e.target.value;
		setSearch(newSearch)
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		props.onBookingSearch(search.type.value, search.search.value, props.token);
	};

	const handleEditClicked = (id, hut) => {
		props.history.push('/admin/'+ hut + "/" + id + "/edit")
	}
		
	const handleDeleteClicked = (id,hut ) => {
		props.history.push('/admin/' + hut + "/" + id + "/delete")
	}	

	return (
<div className="Admin Grey-BG">
		
		<h1 className="DarkBlue">Admin</h1>
		<Switch>
		<Route path="/admin" exact>
		<p>Use the search bar below to view and edit bookings</p>
		<form onSubmit={handleFormSubmit}>
		<div className="FormGroup">
			<select onChange={(e)=>handleInputChange(e, "type")} className="FormControl">
				<option value="_id">Reservation ID</option>
				<option value="userData.name">Name</option>
				<option value="userData.email">Email</option>
				<option value="userData.mobile">Mobile</option>
			</select>
		</div>
		<div className="FormGroup">

									<input
										type="text"
										className={
											"FormControl"
										}
										placeholder="Enter your query"
										value={search.search.value}
										onChange={(e) =>
											handleInputChange(e, "search")
										}
									/>
								</div>
								<button className="Button my-3 Bungee Grey-BG DarkBlue">Submit</button>
								</form>

				<div className="SearchResults">
					{props.loading ? <Loader /> : props.queryResults && props.queryResults.length > 0 ? props.queryResults.map((result,id)=>{
						return <SearchResult booking={result} key={id} editClicked={()=>handleEditClicked(result._id, result.hut)} deleteClicked={()=>handleDeleteClicked(result._id, result.hut)} />
					}) : <p>There are no items matching your search</p>}
				</div>
		</Route>
		<Route path="/admin/:hut/:id/edit" component={EditReservation}/>
		<Route path="/admin/:hut/:id/delete" component={DeleteReservation}/>
		</Switch>
		
		</div>
	);
};

const mapStateToProps = (state) => {
	return {token:state.auth.token,
			queryResults:state.reservations.queryResults,
			loading:state.reservations.loading};
};

const mapDispatchToProps = (dispatch) => {
	return {onBookingSearch: (type, query, token) => dispatch(actions.bookingSearch(type,query, token))};
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
