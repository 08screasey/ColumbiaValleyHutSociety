import React, { useState } from "react";
import { Waypoint } from "react-waypoint";
import "./OpacityAnimation.css";

const OpacityAnimation = (props) => {
	const [inView, setInView] = useState(false);
	let classes = "OpacityAnimation";
	if (inView) {
		classes = "Visible OpacityAnimation";
	}
	const modifyChildren = (child) => {
		const classNames = child.props.className + " " + classes;

		return React.cloneElement(child, {
			className: classNames,
		});
	};
	const children = React.Children.map(props.children, (child) =>
		modifyChildren(child)
	);

	return (
		<Waypoint
			onEnter={() => setInView(true)}
			onLeave={() => setInView(false)}
		>
			<div onClick={props.clicked} className={props.classes}>
				{children}
			</div>
		</Waypoint>
	);
};

export default OpacityAnimation;
