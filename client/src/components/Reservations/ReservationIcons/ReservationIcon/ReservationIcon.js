import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Waypoint } from "react-waypoint";
import "./ReservationIcon.css";
const ReservationIcon = (props) => {
	const [inView, setInView] = useState(false);
	let price = props.hut.price[0];
	if(props.hut.price.length>1){
		let sortedP = props.hut.price.sort((a,b)=>a-b);
		price = `${sortedP[0]}/${sortedP[sortedP.length-1]}`
	}
	return (
		<Waypoint
			onEnter={() => {
				setInView(true);
			}}
			onLeave={() => {
				setInView(false);
			}}
			bottomOffset="300px"
			topOffset="100px"
		>
			<div
				onClick={() => {
					props.history.push(
						`${props.match.url}/${props.hut.dbName}`
					);
				}}
				className={inView ? props.classes + " Visible" : props.classes}
				key={props.hut.name}
			style={{cursor:"pointer"}}>
				<div className="row Info">
					<div className="col-12 d-flex align-items-center justify-content-center">
						<h4 className="Grey">{props.hut.name}</h4>
					</div>
					<div className="col-6">
						<h5 className="Font5 Grey">Price:</h5>
						<h6 className="Grey">${price}</h6>
					</div>
					<div className="col-6">
						<h5 className="Font5 Grey">Max Nights:</h5>
						<h6 className="Grey">{props.hut.maxNights}</h6>
					</div>
				</div>
			</div>
		</Waypoint>
	);
};

export default withRouter(ReservationIcon);
