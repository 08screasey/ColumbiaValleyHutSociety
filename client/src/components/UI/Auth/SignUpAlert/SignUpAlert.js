import React from 'react';
import './SignUpAlert.css';
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {connect} from 'react-redux';

const SignUpAlert = (props) => {
	return (
		<div className="SignUpAlert">
			<FontAwesomeIcon icon={faTimesCircle} onClick={props.closeAlert} className="red m-auto" size="1x"/>
			<h1 className="Green Font5 my-3">Welcome, {props.firstName}!</h1>
			<p className="Font6 mb-3">In order to get the most out of your account please click the link in the verification email sent to {props.email}.</p>
			<small className="Green mb-3 d-block text-center">Didn't get one? <u><span onClick={props.resend} style={{cursor:"pointer"}}>Click here to re-send activation email.</span></u></small>
		</div>
		)
}

const mapStateToProps = state => {
	return {
		firstName:state.auth.userData.firstName,
		email: state.auth.userData.email
	}
}

export default connect(mapStateToProps)(SignUpAlert);