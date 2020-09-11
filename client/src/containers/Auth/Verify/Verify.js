import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import Modal from '../../../components/UI/Modal/Modal';
import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import Loader from '../../../components/UI/Loader/Loader';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as actions from '../../../store/actions/index';

const Verify = (props) => {
	
	const hash = props.location.pathname.split('/verify/')[1];

	useEffect(()=>
		//eslint-disable-next-line
		props.onVerifyEmail(hash),[])

	return (
		<div style={{"height":"800px"}}>
		{props.error && !props.verified ? (<Modal small error >
		<ErrorAlert error={props.error} />
		</Modal>): null}
		{props.verified ? (<Modal small success closeModal={()=>props.history.push('/')}>
			<div className="text-center">
									<FontAwesomeIcon icon={faCheckCircle} className="Green m-auto" size="4x"/>
				<p className="mx-auto my-3">Email address verified!</p>
				</div>
			</Modal>) : null}
		{props.loading ? <Loader /> : null}
	</div>
	)
}

const mapDispatchToProps = dispatch => {
	return {
		onVerifyEmail: (hash) => dispatch(actions.verifyEmail(hash)),
		onClearAuthError:()=>dispatch(actions.clearAuthError())
	}
}

const mapStateToProps = state => {
	return {
		auth: state.auth.token !== null,
		verified:state.auth.userData.active,
		error:state.auth.verificationError,
		loading:state.auth.loading
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Verify)