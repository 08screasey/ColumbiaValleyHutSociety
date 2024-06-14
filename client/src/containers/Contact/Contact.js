import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './Contact.css';
import validityChecker from '../../Utility Functions/Validity Checker';
import formChecker from '../../Utility Functions/Form Check';
import axios from 'axios';
import Loader from '../../components/UI/Loader/Loader';
import Modal from '../../components/UI/Modal/Modal';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ErrorAlert from '../../components/UI/ErrorAlert/ErrorAlert';

const newForm = {
    name: {
        value: '',
        valid: false,
        touched: false,
        validity: { required: true, name: true },
    },
    email: {
        value: '',
        valid: false,
        touched: false,
        validity: { required: true, email: true },
    },
    subject: {
        value: '',
        valid: false,
        touched: false,
        validity: { required: true },
    },
    content: {
        value: '',
        valid: false,
        touched: false,
        validity: { required: true },
    },
};

const Contact = (props) => {
    const [form, setForm] = useState(newForm);
    const [validForm, setValidForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let newForm = { ...form };
        if (props.auth) {
            newForm.name.value = `${props.userData.firstName} ${props.userData.lastName}`;
        }
        newForm.name.valid = true;
        newForm.name.touched = true;
        newForm.email.value = props.userData.email;
        newForm.email.touched = true;
        newForm.email.valid = true;
        setForm(newForm);
    }, [props]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e, identifier) => {
        const newForm = { ...form };
        newForm[identifier].value = e.target.value;
        newForm[identifier].touched = true;
        newForm[identifier].valid = validityChecker(newForm[identifier].validity, newForm[identifier]);
        setForm(newForm);
        setValidForm(formChecker(form));
    };
    const handleSubmit = (e) => {
        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            content: form.content.value,
        };

        setLoading(true);
        setError(false);
        axios
            .post('/api/contact', formData)
            .then((res) => {
                setLoading(false);
                setSuccess(true);
            })
            .catch((err) => {
                setLoading(false);
                setError(err.response);
            });
    };

    const clearForm = () => {
        setForm(newForm);
    };
    return (
        <div className="Contact Grey-BG">
            <div style={{ maxWidth: '800px', margin: 'auto' }}>
                <h1 className="DarkBlue Font0 Outline">Contact Us</h1>
                <p className="Font5 Bungee">
                    Please digest all the information at this website thoroughly before contacting us.
                </p>
                <p>
                    As volunteers, our time is limited to help you choose a Hut, plan your trip or assess whether your
                    party has the skills & experience necessary to safely make the trip. You really need to be confident
                    in your own groups capabilities and experience level.
                </p>
                <p>
                    Generally we do not have current specific road or trail conditions, seasonal changes vary widely
                    from year to year, go prepared for uncertain back country road conditions particularly.
                </p>
            </div>
            {loading ? (
                <Loader />
            ) : error ? (
                <Modal small error closeModal={() => setError(false)}>
                    {' '}
                    <ErrorAlert
                        error={{
                            status: null,
                            message: 'Looks like something went wrong!',
                        }}
                    />{' '}
                </Modal>
            ) : success ? (
                <Modal
                    success
                    small
                    closeModal={() => {
                        clearForm();
                        setSuccess(false);
                    }}
                >
                    <div className="text-center">
                        <FontAwesomeIcon icon={faCheckCircle} className="Green m-auto" size="4x" />
                        <p className="mx-auto my-3">Your inquiry has been received!</p>
                    </div>
                </Modal>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="FormGroup">
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
                        <input
                            type="text"
                            onChange={(e) => handleInputChange(e, 'email')}
                            value={form.email.value}
                            placeholder={'Email'}
                            required
                            className={form.email.touched && !form.email.valid ? 'FormControl Invalid' : 'FormControl'}
                        />
                        {form.email.touched && !form.email.valid ? (
                            <p className="Red d-block text-center m-auto Font6">Please enter your email</p>
                        ) : null}
                    </div>
                    <div className="FormGroup">
                        <input
                            type="text"
                            onChange={(e) => handleInputChange(e, 'subject')}
                            value={form.subject.value}
                            placeholder={'Subject'}
                            required
                            className={
                                form.subject.touched && !form.subject.valid ? 'FormControl Invalid' : 'FormControl'
                            }
                        />
                        {form.subject.touched && !form.subject.valid ? (
                            <p className="Red d-block text-center m-auto Font6">Please enter a valid email</p>
                        ) : null}
                    </div>
                    <div className="FormGroup">
                        <textarea
                            rows="5"
                            type="text"
                            onChange={(e) => handleInputChange(e, 'content')}
                            value={form.content.value}
                            placeholder={'Your Message'}
                            required
                            className={
                                form.content.touched && !form.content.valid ? 'FormControl Invalid' : 'FormControl'
                            }
                        />
                        {form.content.touched && !form.content.valid ? (
                            <p className="Red d-block text-center m-auto Font6">Please enter a valid message</p>
                        ) : null}
                    </div>
                    <button className="Button Blue Grey-BG Bungee my-3" disabled={!validForm}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    return { auth: state.auth.token !== null, userData: state.auth.userData };
};

export default connect(mapStateToProps, null)(Contact);
