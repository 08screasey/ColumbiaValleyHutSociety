import React, { useEffect } from "react";
import "./Reservations.css";
import { connect } from "react-redux";
import ReservationInfo from "../../components/Reservations/ReservationInfo/ReservationInfo";
import ReservationIcons from "../../components/Reservations/ReservationIcons/ReservationIcons";
import ReservationDates from "../../components/Reservations/ReservationDates/ReservationDates";
import ReservationBook from "./ReservationBook/ReservationBook";
import PaymentSuccess from "./ReservationBook/PaymentSuccess/PaymentSuccess";
import LatestAccessUpdates from "../../components/Widgets/LatestAccessUpdates/LatestAccessUpdates";
import { Route, Switch } from "react-router-dom";
import { LazyLoadComponent } from "react-lazy-load-image-component";

const Reservations = (props) => {
	useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<LazyLoadComponent>
			<div className="Reservations Header-BG"></div>
			<div className="ReservationsContainer container-fluid Grey-BG">
				<div className="row">
					<div className="col-lg-8">
						<div className="px-3 py-2 mb-4">
							<h2 className="Font2 m-0 Orange TextOutline">
								Reservations
							</h2>
						</div>

						<Switch>
							{props.auth ? (
								<React.Fragment>
									<Route
										path={props.match.url + "/success"}
										exact
										component={PaymentSuccess}
									/>
									<Route
										path={props.match.url + "/huts/:hut"}
										exact
										component={ReservationDates}
									/>
									<Route
										path={
											props.match.url + "/huts/:hut/book"
										}
										exact
										component={ReservationBook}
									/>
									<Route
										path={props.match.url + "/huts"}
										exact
										component={ReservationIcons}
									/>
									<Route
										path={props.match.url + "/"}
										exact
										component={ReservationInfo}
									/>
								</React.Fragment>
							) : (
								<Route
									path={props.match.url + "/"}
									exact
									component={ReservationInfo}
								/>
							)}
						</Switch>
					</div>
					<div className="col-lg-4 py-5">
						<LatestAccessUpdates />
					</div>
				</div>
			</div>
		</LazyLoadComponent>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth.token !== null,
	};
};

export default connect(mapStateToProps, null)(Reservations);
