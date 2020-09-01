import React, {useState} from "react";
import {connect} from 'react-redux';
import SignUpAlert from "../../components/UI/Auth/SignUpAlert/SignUpAlert";
import "./Home.css";
import Hr from "../../components/UI/Hr/Hr";
import HomeAccessUpdates from "../../components/Widgets/HomeAccessUpdates/HomeAccessUpdates";
import HomeHutSummary from "../../components/Widgets/HomeHutSummary/HomeHutSummary";
import HomeBookings from "../../components/Widgets/HomeBookings/HomeBookings";
import HomeAbout from "../../components/Widgets/HomeAbout/HomeAbout";
import Gallery from "../Gallery/Gallery";
import waveSVG from "../../assets/wave.svg";
import * as actions from "../../store/actions/index";
import {CSSTransition} from 'react-transition-group';

const Home = (props) => {

	const [acknowledged, setAcknowledged] = useState(false);

	return (
		<div className="Home">
		        <CSSTransition classNames="SignUpAnimation" in={props.authenticated && !props.verified && !acknowledged} unmountOnExit timeout={800}>
		        	<SignUpAlert resend={()=>props.onSendVerification(props.userId, props.token)} closeAlert={()=>setAcknowledged(true)}/>
		        	</CSSTransition>
			<div className="Img-Background"></div>
			<div className="position-relative Home-Container">
				<img src={waveSVG} alt="" className="Mountain-svg" />
				<div className="container-fluid Grey-BG">
					<HomeAbout />
					<Hr />
					<HomeBookings />
					<Hr />
					<HomeHutSummary />
					<Hr />
					<HomeAccessUpdates quantity="4"/>
					<Hr />
					<Gallery />
				</div>
			</div>
		</div>
	);
};

const mapDispatchToProps = dispatch => {
	return {
		 onSendVerification:(id, token)=> dispatch(actions.reVerify(id, token))
	}
}

const mapStateToProps = state => {
	return {
		verified:state.auth.userData.active,
		 authenticated: state.auth.token !== null,
    userId: state.auth.userData._id,
    token:state.auth.token,
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Home); 
