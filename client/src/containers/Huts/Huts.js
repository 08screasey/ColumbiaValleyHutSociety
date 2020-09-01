import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Hut from "../../components/Hut/Hut";
import "./Huts.css";
import { HUT_DATA } from "../../Data/HUT_DATA";

const Huts = (props) => {
	const huts = HUT_DATA.slice();
	return (
		<div className="Huts">
			<Switch>
				<Route
					path={props.match.url + "/jumbo"}
					render={() => <Hut hut={huts[0]} />}
				/>
				<Route
					path={props.match.url + "/david-white"}
					render={() => <Hut hut={huts[1]} />}
				/>
				<Route
					path={props.match.url + "/kingsbury"}
					render={() => <Hut hut={huts[2]} />}
				/>
				<Route
					path={props.match.url + "/mcmurdo"}
					render={() => <Hut hut={huts[3]} />}
				/>
				<Route
					path={props.match.url + "/olive"}
					render={() => <Hut hut={huts[4]} />}
				/>
				<Redirect to="/huts/jumbo" />
			</Switch>
		</div>
	);
};

export default Huts;
