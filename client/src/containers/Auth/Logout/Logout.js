import React, { useState, useEffect } from "react";
import * as actions from "../../../store/actions/index";
import { connect } from "react-redux";

const Logout = (props) => {
	useEffect(() => {
		props.onLogout();
		props.history.push("/");
	}, []);
	return <div> </div>;
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(actions.logout()),
	};
};

export default connect(null, mapDispatchToProps)(Logout);
