import React from "react";
import { Waypoint } from "react-waypoint";
import OpacityAnimation from "../../UI/OpacityAnimation/OpacityAnimation";
const HutAccess = (props) => {
	const access = props.access.map((access, index) => {
		return (
			<OpacityAnimation key={index}>
				<p className="P">{access}</p>
			</OpacityAnimation>
		);
	});
	return access;
};

export default HutAccess;
