import React from "react";
import "./HutProvisions.css";
import { ReactComponent as Bedding } from "../../../assets/SVG/bedding.svg";
import { ReactComponent as Mattress } from "../../../assets/SVG/mattress.svg";
import { ReactComponent as Cookware } from "../../../assets/SVG/pot.svg";
import { ReactComponent as Lantern } from "../../../assets/SVG/lightbulb.svg";
import { ReactComponent as Wifi } from "../../../assets/SVG/wifi.svg";
import { ReactComponent as Power } from "../../../assets/SVG/Power.svg";
import { ReactComponent as Water } from "../../../assets/SVG/water.svg";
import { ReactComponent as Stove } from "../../../assets/SVG/stove.svg";
import { ReactComponent as Firewood } from "../../../assets/SVG/firewood.svg";
import { ReactComponent as Bonfire } from "../../../assets/SVG/campfire.svg";

const HutProvisions = (props) => {
	const provisions = [
		"Mattresses",
		"Bedding",
		"Cookware",
		"Stove",
		"Wifi",
		"Power",
		"Firewood",
		"Water",
		"Lantern",
	];
	const components = [
		<Mattress className="w-25" />,
		<Bedding className="w-25" />,
		<Cookware className="w-25" />,
		<Stove className="w-25" />,
		<Wifi className="w-25" />,
		<Power className="w-25" />,
		<Firewood className="w-25" />,
		<Water className="w-25" />,
		<Lantern className="w-25" />,
	];

	const prohibited = {
		Bonfires: <Bonfire className="w-25" />,
	};

	const provisionList = provisions.map((key, i) => {
		const classes = [
			"Provision",
			"d-flex",
			"justify-content-around",
			"align-items-center",
			"mx-2",
		];
		let text = "Not Provided";

		if (!!props.provisions[key.toLowerCase()]) {
			if (typeof props.provisions[key.toLowerCase()] === "string") {
				classes.push("Limited");
				text = props.provisions[key.toLowerCase()];
			} else {
				classes.push("Available");
				text = "Available";
			}
		}
		return (
			<li className={classes.join(" ")} key={i}>
				{components[i]}
				<div classes="w-75" style={{ marginLeft: "10px" }}>
					<p className="Font5 p-0 my-0">{key}</p>
					<p className="Font6">{text}</p>
				</div>
			</li>
		);
	});

	const prohibitedList = Object.keys(prohibited).map((key, i) => {
		const classes = [
			"Prohibited",
			"d-flex",
			"justify-content-around",
			"align-items-center",
			"mx-2",
		];
		if (props.prohibited.indexOf(key.toLowerCase()) !== -1) {
			classes.push("Red");
		}
		return (
			<li className={classes.join(" ")} key={i}>
				{prohibited[key]}
				<div classes="w-75" style={{ marginLeft: "10px" }}>
					<p className="Font4 p-0 my-0">{key}</p>
				</div>
			</li>
		);
	});

	return (
		<React.Fragment>
			<div className="Raised p-2">
				<h4 className="DarkBlue Font0">What's At The Hut</h4>
				<ul className="ProvisionList d-flex flex-wrap justify-content-center p-0">
					{provisionList}
				</ul>
			</div>
			<div className="Raised Red-BG p-2 my-3 w-75 mx-auto">
				<h4 className="Red Font4 mt-3">Prohibited Items</h4>
				<ul className="d-flex ProhibitedList flex-wrap justify-content-center p-0">
					{prohibitedList}
				</ul>
			</div>
		</React.Fragment>
	);
};

export default HutProvisions;
