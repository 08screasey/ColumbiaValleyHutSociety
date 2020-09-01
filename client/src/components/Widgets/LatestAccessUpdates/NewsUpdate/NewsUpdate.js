import React from "react";
import "./NewsUpdate.css";
import OpacityAnimation from "../../../UI/OpacityAnimation/OpacityAnimation";
import {withRouter} from 'react-router-dom';
const NewsUpdate = (props) => {
	return (<React.Fragment>
		<hr className="m-0 mx-5"/>
		<li className="NewsUpdate pt-1 pb-3 text-left px-4" onClick={()=>props.history.push("/updates/"+props.update._id)}>
			
			<small className="text-center p-2 w-100 d-block DarkBlue">
				{new Date(props.update.date).toLocaleDateString()}
			</small>
			<h5 className="DarkBlue Font5 text-center">
				{props.update.header}
			</h5>
			<p className="Font5">
				{props.update.content.substring(0, 180)} ...
			</p>
		</li>
		</React.Fragment>
	);
};

export default withRouter(NewsUpdate);
