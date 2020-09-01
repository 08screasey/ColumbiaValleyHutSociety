import React from "react";
import { connect } from "react-redux";
import Modal from '../../../../components/UI/Modal/Modal';
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditUpdate = (props) => {
	return (
		<div className="w-100">
		{props.updateSuccess ? <Modal small success closeModal={props.closeEdit}>
			<div className="text-center">
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="Green m-auto"
							size="4x"
						/>
						<p className="mx-auto my-3">
							Post successfully submitted
						</p>
					</div>
		</Modal> : null}
			<form onSubmit={props.formSubmit}>
				<div>
					<input
						type="text"
						className={
							props.form.header.touched && !props.form.header.valid
								? "FormControl Invalid"
								: "FormControl"
						}
						placeholder="Header"
						value={props.form.header.value}
						onChange={(e) => props.inputChange(e, "header")}
					/>
					{props.form.header.touched && !props.form.header.valid ? (
						<p className="Red d-block text-center m-auto Font6">
							Please enter a title for your post
						</p>
					) : null}
				</div>
				<div className="FormGroup">
					<textarea
					rows="10"
						className={
							props.form.content.touched && !props.form.content.valid
								? "w-100 Invalid FormControl"
								: "w-100 FormControl"
						}
						placeholder="Content"
						value={props.form.content.value}
						onChange={(e) => props.inputChange(e, "content")}
					/>
					{props.form.content.touched && !props.form.content.valid ? (
						<p className="Red d-block text-center m-auto Font6">
							Please enter valid content for this update
						</p>
					) : null}
				</div>
				<button className="Button" disabled={props.disabled}>Submit</button>
			</form>
		</div>
	);
};

export default EditUpdate;
