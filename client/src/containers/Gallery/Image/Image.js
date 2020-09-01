import React, { useState } from "react";
import "./Image.css";

const Image = (props) => {
	const [enlarged, setEnlarged] = useState(false);

	const clickHandler = () => {
		props.onEnlarge(true);
		setEnlarged(true);
	};

	return (
		<React.Fragment>
			<div
				className={enlarged ? "Enlarge Active" : "Enlarge"}
				onClick={() => {
					props.onEnlarge(false);
					setEnlarged(false);
				}}
			></div>
			<img
				src={props.source}
				className={enlarged ? "Enlarge-Image" : null}
				onClick={() => clickHandler()}
			/>
		</React.Fragment>
	);
};

export default Image;
