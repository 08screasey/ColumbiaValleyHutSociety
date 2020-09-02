import React from "react";
import { Waypoint } from "react-waypoint";
import OpacityAnimation from "../../UI/OpacityAnimation/OpacityAnimation";
const HutAccess = (props) => {
	const access = props.access.map((access, index) => {
		return (
			
				<p className="P" key={index}>{access}</p>
			
		);
	});
	return (<OpacityAnimation>
	{access}
	</OpacityAnimation>)
	;
};

export default HutAccess;
