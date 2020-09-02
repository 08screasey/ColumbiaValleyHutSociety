import React, { useState } from "react";
import { Waypoint } from "react-waypoint";
import { Link } from "react-router-dom";
import Hr from "../../../UI/Hr/Hr";
import "./HomeHutIcon.css";

const HomeHutIcon = (props) => {
	const [inView, setInView] = useState(false);
	const handleWaypointEnter = () => {
		setInView(true);
	};
	return (
		<Waypoint onEnter={handleWaypointEnter} >
			<div className="col-md-6 col-lg-4">
				<div
					className={
						inView
							? "HomeHutIcon DarkBlue-BG Enter"
							: "HomeHutIcon Exit"
					}
				>
					<Link to={props.link}>
						<img
							src={props.imgPath}
							alt=""
							className="HomeHutIconImg"
						/>
						<div className="HomeHutIconHeader d-flex align-items-center justify-content-end">
							<h3 className="Font4 Grey text-right">
								{props.cabin}
							</h3>
						</div>
					</Link>
					<div className="CardBreak">
						<Hr />
					</div>
					<div className="HomeHutIconContent">
						<p className="Grey text-left Font5 p-4 mb-0">
							{props.content}
						</p>
					</div>
				</div>
			</div>
		</Waypoint>
	);
};

export default HomeHutIcon;
