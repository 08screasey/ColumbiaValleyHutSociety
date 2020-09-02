import React from "react";
import { Waypoint } from "react-waypoint";
import OpacityAnimation from "../../UI/OpacityAnimation/OpacityAnimation";

const HutAbout = (props) => {
	const about = props.details.map((details, index) => {
		return (
				<p className="P" key={index}>{details}</p>
			
		);
	});
	return (<OpacityAnimation>{about}</OpacityAnimation>);
};

export default HutAbout;
