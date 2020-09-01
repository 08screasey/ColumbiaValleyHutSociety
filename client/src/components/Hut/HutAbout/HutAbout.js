import React from "react";
import { Waypoint } from "react-waypoint";
import OpacityAnimation from "../../UI/OpacityAnimation/OpacityAnimation";

const HutAbout = (props) => {
	const about = props.details.map((details, index) => {
		return (
			<OpacityAnimation key={index}>
				<p className="P">{details}</p>
			</OpacityAnimation>
		);
	});
	return about;
};

export default HutAbout;
