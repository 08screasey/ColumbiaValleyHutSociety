import React from 'react';
import './ErrorAlert.css';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ErrorAlert = (props) => {
    return (
        <div className="ErrorAlert p-3 d-flex flex-column align-items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="BrightRed text-center m-auto" size="4x" />
            <h1 className="Font5 text-center mt-3 mb-1">{props.error.status ? props.error.status : 'Oh No!'}</h1>
            <p className="Font5">{props.error.message}</p>
        </div>
    );
};

export default ErrorAlert;
