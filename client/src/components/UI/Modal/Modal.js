import React, { useState, useEffect } from 'react';
import './Modal.css';
import { CSSTransition } from 'react-transition-group';

const Modal = (props) => {
    const classes = ['Modal', 'rounded', 'd-flex', 'justify-content-center', 'align-items-center', 'Grey-BG'];
    const [active, setActive] = useState(false);
    useEffect(() => {
        setActive(true);
    }, []);
    if (props.error) {
        classes.push('Error');
    }
    if (props.success) {
        classes.push('Success');
    }
    if (props.big) {
        classes.push('Big');
    }
    if (props.small) {
        classes.push('Small');
    }
    return (
        <React.Fragment>
            <div className="Backdrop" onClick={props.touchedBackdrop}></div>
            <CSSTransition
                unmountOnExit
                timeout={800}
                in={active}
                onExited={props.closeModal}
                classNames="ModalAnimation"
            >
                <div className={classes.join(' ')}>
                    <div className="position-relative w-100 h-100 d-flex Content justify-content-center align-items-center">
                        {props.children}
                        {props.success || props.error ? (
                            <button onClick={() => setActive(false)}>{props.error ? 'Ok!' : 'Thank You!'}</button>
                        ) : null}
                    </div>
                </div>
            </CSSTransition>
        </React.Fragment>
    );
};

export default Modal;
