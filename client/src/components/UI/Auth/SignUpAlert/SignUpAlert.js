import React from 'react';
import './SignUpAlert.css';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';

const SignUpAlert = (props) => {
    return (
        <div className="SignUpAlert">
            <FontAwesomeIcon icon={faTimesCircle} onClick={props.closeAlert} className="BrightBlue m-auto" size="1x" />
            <h1 className="DarkBlue Font5 my-3">Welcome, {props.firstName}!</h1>
            <p className="Font5 mb-3">
                In order to get the most out of your account please click the link in the verification email sent to{' '}
                {props.email}.
            </p>
            <small className="DarkBlue mb-3 Font5 d-block text-center">
                Didn't get one?{' '}
                <u>
                    <strong onClick={props.resend} style={{ cursor: 'pointer' }}>
                        Click here to re-send activation email.
                    </strong>
                </u>
            </small>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        firstName: state.auth.userData.firstName,
        email: state.auth.userData.email,
    };
};

export default connect(mapStateToProps)(SignUpAlert);
