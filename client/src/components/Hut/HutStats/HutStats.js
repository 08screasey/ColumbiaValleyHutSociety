import React from "react";
import { ReactComponent as Altitude } from "../../../assets/SVG/altitude.svg";
import { ReactComponent as Elevation } from "../../../assets/SVG/sports-and-competition.svg";
import { ReactComponent as Distance } from "../../../assets/SVG/signs.svg";
import { ReactComponent as Sledding } from "../../../assets/SVG/transport.svg";
import { ReactComponent as Sleeps } from "../../../assets/SVG/furniture-and-household.svg";
import { ReactComponent as MaxNights } from "../../../assets/SVG/buildings (1).svg";
import { ReactComponent as Maps } from "../../../assets/SVG/maps-and-location.svg";
import { ReactComponent as Road } from "../../../assets/SVG/symbol.svg";
const HutStats = (props) => {
	return (
		<div className="Hut-Facts">
			<div className="row Grey">
				<div className="col-6">
					<ul className=" m-0 h-100 d-flex flex-column justify-content-between">
						<li className="d-flex align-items-center my-3 mx-2">
							<Altitude className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Altitude</h5>
								<p>{props.hut.altitude}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<Distance className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Distance</h5>
								<p>{props.hut.hikingDistance}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<Sleeps className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Sleeps</h5>
								<p>{props.hut.sleeps}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<Road className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Access Road</h5>
								<p>{props.hut.accessRoad}</p>
							</div>
						</li>
					</ul>
				</div>
				<div className="col-6">
					<ul className=" m-0 h-100 d-flex flex-column justify-content-between">
						<li className="d-flex align-items-center my-3 mx-2">
							<Elevation className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Elevation</h5>
								<p>{props.hut.elevation}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<Sledding className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Sledding</h5>
								<p>{props.hut.sleddingDistance}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<MaxNights className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Max Nights</h5>
								<p>{props.hut.maxNights}</p>
							</div>
						</li>
						<li className="d-flex align-items-center my-3 mx-2">
							<Maps className="w-25" />
							<div className="w-75">
								<h5 className="Font5">Co-ordinates</h5>
								<p className="ml-2">{props.hut.mapping}</p>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default HutStats;
