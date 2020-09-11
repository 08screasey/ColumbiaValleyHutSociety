import React, { useState, useEffect } from "react";
import "./Auth.css";
import ErrorAlert from "../../components/UI/ErrorAlert/ErrorAlert";
import Loader from "../../components/UI/Loader/Loader";
import { connect } from "react-redux";
import checkValidity from '../../Utility Functions/Validity Checker';
import formChecker from '../../Utility Functions/Form Check';
import Modal from '../../components/UI/Modal/Modal';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as actions from "../../store/actions/index";

const Auth = (props) => {
	const [signUp, setSignUp] = useState(false);

	useEffect(()=>{ if(props.auth){props.history.push('/')}}, []) // eslint-disable-line react-hooks/exhaustive-deps

	const [form, setForm] = useState({
		email: {
			value: "",
			valid: false,
			touched: false,
			validity: { required: true, email: true },
		},
		password: {
			value: "",
			valid: false,
			touched: false,
			validity: { required: true, minLength: 8 },
		},
	});
	
	const [validForm, setValidForm] = useState(false);

	const handleSignUpChange = () => {
		if (signUp) {
			setForm({ email: form.email, password: form.password });
		} else {
			setForm({
				...form,
				firstName: {
					value: "",
					valid: false,
					touched: false,
					validity: { required: true, name: true },
				},
				lastName: {
					value: "",
					valid: false,
					touched: false,
					validity: { required: true, name: true },
				},
				phone: {
					value:"",
					valid:false,
					touched:false,
					validity: {required:true, phone:true}
				},
				confirmPassword: {
					value: "",
					valid: false,
					touched: false,
					validity: {
						required: true,
						passwordMatch: true,
						minLength: 8,
					},
				},
			});
		}
		setSignUp(!signUp);
		setValidForm(false);
	};


	const handleInputChange = (e, identifier) => {
		const newForm = { ...form };
		newForm[identifier].value = e.target.value;
		newForm[identifier].touched = true;
		newForm[identifier].valid = checkValidity(
			newForm[identifier].validity,
			newForm[identifier]
		);
		setForm(newForm);
		setValidForm(formChecker(form))
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();
		const newForm = {};
		Object.keys(form).forEach((key) => {
			newForm[key] = form[key].value;
		});

		props.onAuthSubmit(newForm, signUp);
	};

	return (
		<div className="Auth Grey-BG pb-5">
			{props.error ? (
				<Modal small error closeModal={()=>props.onClearAuthError()}>
				<ErrorAlert
					error={props.error}
				/>
				</Modal>
			) : null}
			{props.auth ? <Modal small success closeModal={()=>props.history.push('/')}> 
				<div className="text-center">
				<FontAwesomeIcon icon={faCheckCircle} className="Green m-auto" size="4x"/>
				<p className="mx-auto my-3">Welcome, {props.firstName}!</p>
				</div>
				</Modal>: null}
			<div className="Header-BG"></div>
			{props.loading ? (
				<Loader />
			) : (
				<form
					className="AuthForm  pt-4 py-4"
					onSubmit={handleFormSubmit}
				>
					<h2 className="TextOutline DarkBlue mb-5">Login/Sign Up</h2>
					<div className={signUp ? "SignUp Visible" : "SignUp"}>
						{signUp ? (
							<React.Fragment>
								<div className="FormGroup">
									<input
										type="text"
										className={
											form.firstName.touched &&
											!form.firstName.valid
												? "FormControl Invalid"
												: "FormControl"
										}
										placeholder="First Name"
										value={form.firstName.value}
										onChange={(e) =>
											handleInputChange(e, "firstName")
										}
									/>
									{form.firstName.touched &&
									!form.firstName.valid ? (
										<p className="Red d-block text-center mx-auto mt-2 Font6">
											Please enter your first name
										</p>
									) : null}
								</div>
								<div className="FormGroup">
									<input
										type="text"
										className={
											form.lastName.touched &&
											!form.lastName.valid
												? "FormControl Invalid"
												: "FormControl"
										}
										placeholder="Last Name"
										value={form.lastName.value}
										onChange={(e) =>
											handleInputChange(e, "lastName")
										}
									/>
									{form.lastName.touched &&
									!form.lastName.valid ? (
										<p className="Red d-block text-center mx-auto mt-2 Font6">
											Please enter your last name
										</p>
									) : null}
								</div>
								<div className="FormGroup">
									<input
										type="text"
										className={
											form.phone.touched &&
											!form.phone.valid
												? "FormControl Invalid"
												: "FormControl"
										}
										placeholder="Mobile No."
										value={form.phone.value}
										onChange={(e) =>
											handleInputChange(e, "phone")
										}
									/>
									{form.phone.touched &&
									!form.phone.valid ? (
										<p className="Red d-block text-center mx-auto mt-2 Font6">
											Please enter a valid mobile number.
										</p>
									) : null}
								</div>
							</React.Fragment>
						) : null}
					</div>
					<div className="FormGroup">
						<input
							type="text"
							className={
								form.email.touched && !form.email.valid
									? "FormControl Invalid"
									: "FormControl"
							}
							placeholder="Email"
							value={form.email.value}
							onChange={(e) => handleInputChange(e, "email")}
						/>
						{form.email.touched && !form.email.valid ? (
							<p className="Red d-block text-center mx-auto mt-2 Font6">
								Please enter a valid email
							</p>
						) : null}
					</div>
					<div className="FormGroup">
						<input
							type="password"
							className={
								form.password.touched && !form.password.valid
									? "FormControl Invalid"
									: "FormControl"
							}
							placeholder="Password"
							value={form.password.value}
							onChange={(e) => handleInputChange(e, "password")}
						/>
						{form.password.touched && !form.password.valid ? (
							<p className="Red d-block text-center mx-auto mt-2 Font6">
								Password must be longer than 8 characters
							</p>
						) : null}
					</div>
					{signUp ? (
						<div className="FormGroup">
							<input
								type="password"
								className={
									form.confirmPassword.touched &&
									!form.confirmPassword.valid
										? "FormControl Invalid"
										: "FormControl"
								}
								placeholder="Confirm Password"
								value={form.confirmPassword.value}
								onChange={(e) =>
									handleInputChange(e, "confirmPassword")
								}
							/>
							{form.confirmPassword.touched &&
							!form.confirmPassword.valid ? (
								<p className="Red d-block text-center mx-auto mt-2 Font6">
									Your passwords must match
								</p>
							) : null}
						</div>
					) : null}

					<div className="FormGroup Raised py-2 mt-5">
						<button className="d-block m-auto Login Bungee Blue Font4 TextOutline" disabled={!validForm}>
							{signUp ? "Sign Up" : "Login"}
						</button>
					</div>
				</form>
			)}
			<p className="Font6 Blue Link" onClick={handleSignUpChange}>
				{signUp
					? "Already registered? Click here to login!"
					: "Not registered? Click here to sign up!"}
			</p>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth.token !== null,
		loading: state.auth.loading,
		error: state.auth.error,
		firstName: state.auth.userData.firstName
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuthSubmit: (formData, isSignUp) =>
			dispatch(actions.auth(formData, isSignUp)),
		onClearAuthError: () => dispatch(actions.clearAuthError()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
