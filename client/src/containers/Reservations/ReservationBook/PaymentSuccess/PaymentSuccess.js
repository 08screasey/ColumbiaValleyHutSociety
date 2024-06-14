import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as actions from '../../../../store/actions/index';
import Modal from '../../../../components/UI/Modal/Modal';
import ErrorAlert from '../../../../components/UI/ErrorAlert/ErrorAlert';
import Loader from '../../../../components/UI/Loader/Loader';
import BookingReview from '../../../../components/Reservations/BookingReview/BookingReview';

const PaymentSuccess = (props) => {
    const location = useLocation();

    useEffect(() => {
        const userInfo = {};
        userInfo.name = localStorage.getItem('name');
        userInfo.email = localStorage.getItem('email');
        userInfo.mobile = localStorage.getItem('mobile');
        userInfo.userId = localStorage.getItem('userId');

        const dates = localStorage.getItem('dates').split(',');
        const hut = localStorage.getItem('hut');

        const paymentId = new URLSearchParams(location.search).get('paymentId');
        const token = new URLSearchParams(location.search).get('token');
        const payerId = new URLSearchParams(location.search).get('PayerID');

        const paymentInfo = { paymentId, token, payerId };

        props.onFinaliseBooking(userInfo, dates, hut, props.token, paymentInfo);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="PaymentSuccess">
            {props.completedReservation ? (
                <Modal
                    big
                    success
                    closeModal={() => {
                        props.onUpdateUserData(props.completedReservation, 'reservations');
                        props.onResetBooking();
                        props.history.push('/account-info');
                    }}
                >
                    <BookingReview bookingDetails={props.completedReservation} />
                </Modal>
            ) : props.error ? (
                <Modal
                    small
                    error
                    closeModal={() => {
                        props.onClearError('fetchError');
                        props.history.push('/');
                    }}
                >
                    <ErrorAlert error={props.error} />
                </Modal>
            ) : props.loading ? (
                <Loader />
            ) : null}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        loading: state.reservations.loading,
        booking: state.reservations.booking,
        userData: state.auth.userData,
        completedReservation: state.reservations.completedReservation,
        error: state.reservations.fetchError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onFinaliseBooking: (u, d, h, t, p) => dispatch(actions.finaliseBooking(u, d, h, t, p)),
        onUpdateUserData: (data, locator) => dispatch(actions.updateUserData(data, locator)),
        onClearError: (error) => dispatch(actions.clearError(error)),
        onResetBooking: () => dispatch(actions.resetBooking()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSuccess);
