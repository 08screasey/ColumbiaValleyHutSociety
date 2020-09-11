import React, {useState} from 'react';
import {connect} from 'react-redux';
import checkValidity from '../../../Utility Functions/Validity Checker';
import checkForm from '../../../Utility Functions/Form Check';
import * as actions from '../../../store/actions/index';
import Modal from '../../../components/UI/Modal/Modal';
import { faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorAlert from '../../../components/UI/ErrorAlert/ErrorAlert';
import './CreateUpdate.css';

const CreateUpdate = (props) => {

const [form, setForm] = useState({
	header: {
			value: "",
			valid: false,
			touched: false,
			validity: { required: true},
		},
		content: {
			value: "",
			valid: false,
			touched: false,
			validity: { required: true},
		}
});
const [validity, setValidity] = useState(false);

const handleInputChange = (e,identifier) => {
	const newForm = {...form};
	newForm[identifier].value = e.target.value;
	newForm[identifier].touched = true;
	newForm[identifier].valid = checkValidity(newForm[identifier].validity, newForm[identifier]);
	setForm(newForm);
	setValidity(checkForm(form));
}

const handleFormSubmit = (e) => {
	e.preventDefault();
	const post = {header:form.header.value,
		content:form.content.value,
		comments:[]}
	props.onCreateUpdate(post, props.token);
}

	return (<div className="CreateUpdate Grey-BG">
		{props.error ? <Modal small error closeModal={()=>props.onClearError()}>
			<ErrorAlert error={props.error}/>
		</Modal> : props.update ? <Modal small success closeModal={()=>{props.onClearUpdate();
			props.history.push('/updates')}}>
			<div className="text-center">
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="Green m-auto"
							size="4x"
						/>
						<p className="mx-auto my-3">
							Update successfully created.
						</p>
					</div>
		</Modal> :null}
	<h2 className="mb-2 DarkBlue">Create New Post</h2>
	<form onSubmit={handleFormSubmit}>
				<div className="FormGroup">
									<input
										type="text"
										className={
											form.header.touched &&
											!form.header.valid
												? "FormControl Invalid"
												: "FormControl"
										}
										placeholder="Header"
										value={form.header.value}
										onChange={(e) =>
											handleInputChange(e, "header")
										}
									/>
									{form.header.touched &&
									!form.header.valid ? (
										<p className="Red d-block text-center m-auto Font6">
											Please enter a valid header
										</p>
									) : null}
								</div>
								<div className="FormGroup">
									<textarea
									rows="10"
										className={
											form.content.touched &&
											!form.content.valid
												? "FormControl Invalid"
												: "FormControl"
										}
										placeholder="Content"
										value={form.content.value}
										onChange={(e) =>
											handleInputChange(e, "content")
										}
									/>
									{form.content.touched &&
									!form.content.valid ? (
										<p className="Red d-block text-center m-auto Font6">
											Content required.
										</p>
									) : null}
								</div>
						<button className="Button Grey-BG DarkBlue Bungee" disabled={!validity}> Submit </button>
	</form>
</div>)
};

const mapStateToProps = state => {
	return {token:state.auth.token,
		error:state.news.error,
		update:state.news.newUpdate}
};

const mapDispatchToProps = dispatch => {
	return {
	onCreateUpdate:(post, token)=> dispatch(actions.addNews(post, token)),
	onClearError: () => dispatch(actions.clearNewsError()),
	onClearUpdate:()=>dispatch(actions.clearUpdate())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateUpdate)