import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as actions from '../../../../store/actions/index';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../../../../components/UI/Modal/Modal';
import validityChecker from '../../../../Utility Functions/Validity Checker';
import BookingReview from '../../../../components/Reservations/BookingReview/BookingReview';
import moment from 'moment';
import ReservationDates from '../../../../components/Reservations/ReservationDates/ReservationDates';
import ErrorAlert from '../../../../components/UI/ErrorAlert/ErrorAlert';

const EditReservation = (props) => {
    const findOne = (id) => {
        return props.queryResults.filter((result) => result._id === id)[0];
    };

    const [bookingToEdit] = useState(findOne(props.match.params.id));

    const [form, setForm] = useState({
        name: { value: '', valid: true, touched: true, validity: { required: true, name: true } },
        email: {
            value: '',
            valid: true,
            touched: true,
            validity: { required: true, email: true },
        },
        mobile: {
            value: '',
            valid: true,
            touched: true,
            validity: { required: true, phone: true },
        },
    });

    //const [validForm, setValidForm] = useState(false);

    const [dates, setDates] = useState(null);
    const [proceed, setProceed] = useState(false);

    useEffect(
        () => {
            if (bookingToEdit) {
                const newForm = { ...form };
                for (let key in form) {
                    newForm[key].value = bookingToEdit.userData[key];
                }
                setForm(newForm);
                setDates(bookingToEdit.dates);
            }
        },
        //eslint-disable-next-line
        [],
    );

    if (!bookingToEdit) {
        return <Redirect to="/" />;
    }

    const handleInputChange = (e, identifier) => {
        const newForm = { ...form };
        newForm[identifier].value = e.target.value;
        newForm[identifier].touched = true;
        newForm[identifier].valid = validityChecker(newForm[identifier].validity, newForm[identifier]);
        setForm(newForm);
        //setValidForm(formChecker(form))
    };
    const handleUpdateDates = (d1, d2) => {
        const dateRange = moment.range(d1, d2);
        const formattedDates = Array.from(dateRange.by('day')).map((date) => date.format('ddd MMM DD YYYY'));
        setDates(formattedDates);
        setProceed(true);
    };

    const handleSubmit = () => {
        props.onEditReservation(
            bookingToEdit._id,
            { dates: dates, userData: { name: form.name.value, email: form.email.value, mobile: form.mobile.value } },
            props.token,
        );
        setProceed(false);
    };

    return (
        <div className="EditReservation">
            {proceed ? (
                <Modal big closeModal={() => setProceed(false)}>
                    <BookingReview
                        editing
                        bookingDetails={{
                            dates: dates,
                            _id: bookingToEdit._id,
                            userData: { name: form.name.value, email: form.email.value, mobile: form.mobile.value },
                        }}
                    />
                    <button onClick={handleSubmit}>Submit</button>
                </Modal>
            ) : null}
            {props.queryStatus === 'Editing' ? (
                <Modal
                    small
                    success
                    closeModal={() => {
                        props.onClearQueryStatus();
                        props.history.push('/admin');
                    }}
                >
                    <div className="text-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="Green m-auto" size="4x" />
                        <p className="mx-auto my-3">Booking successfully updated</p>
                    </div>
                </Modal>
            ) : props.selectError ? (
                <Modal small error closeModal={() => props.onClearError('selectError')}>
                    <ErrorAlert error={props.selectError} />
                </Modal>
            ) : null}
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="FormGroup">
                    <label>Name:</label>
                    <input
                        type="text"
                        onChange={(e) => handleInputChange(e, 'name')}
                        value={form.name.value}
                        placeholder={'Name'}
                        required
                        className={form.name.touched && !form.name.valid ? 'FormControl Invalid' : 'FormControl'}
                    />
                    {form.name.touched && !form.name.valid ? (
                        <p className="Red d-block text-center m-auto Font6">Please enter your name</p>
                    ) : null}
                </div>
                <div className="FormGroup">
                    <label>Email:</label>
                    <input
                        type="text"
                        onChange={(e) => handleInputChange(e, 'email')}
                        value={form.email.value}
                        placeholder={'Email'}
                        required
                        className={form.email.touched && !form.email.valid ? 'FormControl Invalid' : 'FormControl'}
                    />
                    {form.email.touched && !form.email.valid ? (
                        <p className="Red d-block text-center m-auto Font6">Please enter a valid email</p>
                    ) : null}
                </div>
                <div className="FormGroup">
                    <label>Phone:</label>
                    <input
                        type="text"
                        onChange={(e) => handleInputChange(e, 'mobile')}
                        value={form.mobile.value}
                        placeholder={'Phone Number'}
                        required
                        className={form.mobile.touched && !form.mobile.valid ? 'FormControl Invalid' : 'FormControl'}
                    />
                    {form.mobile.touched && !form.mobile.valid ? (
                        <p className="Red d-block text-center m-auto Font6">Please enter a valid mobile number</p>
                    ) : null}
                </div>
            </form>
            <ReservationDates
                admin
                editing={bookingToEdit}
                onUpdateBooking={(date1, date2) => {
                    handleUpdateDates(date1, date2);
                }}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        queryResults: state.reservations.queryResults,
        queryStatus: state.reservations.queryStatus,
        token: state.auth.token,
        selectError: state.reservations.selectError,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClearQueryStatus: () => dispatch(actions.clearQueryStatus()),
        onEditReservation: (id, data, token) => dispatch(actions.editReservation(id, data, token)),
        onClearError: (err) => dispatch(actions.clearError(err)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditReservation);
