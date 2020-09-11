import React from "react";
import { HUT_DATA } from "../../../Data/HUT_DATA";
import ReservationIcon from "./ReservationIcon/ReservationIcon";
import { withRouter } from "react-router-dom";
import "./ReservationIcons.css";

const ReservationIcons = (props) => {
	const huts = HUT_DATA.map((hut, index) => {
		const classNames = `Icon Icon${index}`;
		return (
			<ReservationIcon hut={hut} classes={classNames} key={hut.name} />
		);
	});
	return (
		<div className="ReservationIcons py-3 ">
			<h3 className="Blue Font3">Select A Cabin</h3>
			<div className="d-flex flex-wrap justify-content-around" >
				{huts}
			</div>
		</div>
	);
};

export default withRouter(ReservationIcons);
