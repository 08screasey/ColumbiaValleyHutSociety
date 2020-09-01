import React, { useState } from "react";
import checkValidity from "../../../../Utility Functions/Validity Checker";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import Comment from "../../../../components/UI/Comment/Comment";
import * as actions from "../../../../store/actions/index";
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ErrorAlert from "../../../../components/UI/ErrorAlert/ErrorAlert";
import Modal from "../../../../components/UI/Modal/Modal";
import "./Comments.css";

const Comments = (props) => {
	const [addComment, setComment] = useState(false);
	const [comments, setComments] = useState(props.comments.slice());
	const postId = props.location.pathname.split("/")[2];

	const [form, setForm] = useState({
		content: {
			value: "",
			valid: false,
			touched: false,
			validity: { required: true, maxLength: 350 },
		},
	});
	const [formValidity, setValidity] = useState(false);

	const handleInputChange = (e, identifier) => {
		const newForm = { ...form };
		newForm[identifier].value = e.target.value;
		newForm[identifier].touched = true;
		newForm[identifier].valid = checkValidity(
			newForm[identifier].validity,
			newForm[identifier],
			form
		);
		let validForm = true;
		for (let key in form) {
			if (!form[key].valid || validForm === false) {
				validForm = false;
			}
		}
		setForm(newForm);
		setValidity(validForm);
	};

	const handleFormSubmit = (e) => {
		e.preventDefault();

		const formData = {
			content: form.content.value,
			author: props.name,
			userId: props.userId,
		};
		props.onFormSubmit(formData, postId, props.token);
		
	};

	const handleDeleteComment = (comment) => {
		if (comment._id) {
			props.onDeleteComment(props.token, postId, comment);
		}
		const newComments = comments.filter((text) => {
			return text._id !== comment._id;
		});
		setComments(newComments);
	};

	let content = <p className="pl-4 py-2">There are no comments to show.</p>;
	if (comments && comments.length > 0) {
		content = comments.map((comment, id) => {
			return (
				<Comment
					comment={comment}
					id={id}
					key={id}
					admin={props.admin}
					userId={props.userId}
					clicked={() => {
						handleDeleteComment(comment);
					}}
				/>
			);
		});
	}

	return (
		<div className="p-3 Raised w-75 text-left rounded m-auto">
			{!!props.commentAdded ? (
				<Modal
					small
					success
					closeModal={() => {
						setComments(comments.concat({ content:form.content.value, author:props.name, userId:props.userId, date: new Date() }));
						props.onUpdateUserData(props.commentAdded, "comments");
						props.onResetComment();
						const newForm = {
				content: {
				value: "",
				valid: false,
				touched: false,
				validity: { required: true, maxLength: 350 },
			},
		};
		setForm(newForm);
					}}
				>
					<div className="text-center">
						<FontAwesomeIcon
							icon={faCheckCircle}
							className="Green m-auto"
							size="4x"
						/>
						<p className="mx-auto my-3">
							Comment successfully submitted
						</p>
					</div>
				</Modal>
			) : props.error ? (
				<Modal
				small
				error
				closeModal={() => {
							//props.onClearNewsError();
							props.onResetComment();
						}}
					>
					<ErrorAlert
						error={props.error}
						
					/>
				</Modal>
			) : null}

			<h4 className="text-left DarkBlue">Comments</h4>
			<hr className="mb-4"/>
			{content}
			<form className="text-center" onSubmit={(e) => handleFormSubmit(e)}>
				<div
					className="AddComment position-relative"
					style={{
						overflow: "hidden",
						height: addComment ? "auto" : "0px",
						transition: "1s",
					}}
				>
					
					<div className="FormGroup position-relative">
					<span
						className="position-absolute d-block Red Font4"
						style={{ top: "10px", right: "10px" }}
						onClick={() => setComment(false)}
					>
						<FontAwesomeIcon
							icon={faTimesCircle}
							className="Red m-auto"
							size="1x"
						/>
					</span>
						<textarea
							required
							rows="6"
							className={
								form.content.touched && !form.content.valid
									? "FormControl Invalid"
									: "FormControl"
							}
							placeholder="Enter Your Comment Here"
							value={form.content.value}
							onChange={(e) => handleInputChange(e, "content")}
						></textarea>
						<small
							style={{
								color:
									form.content.value.length > 350
										? "red"
										: "grey",
							}}
						>
							{form.content.value.length}/350
						</small>
						{form.content.touched &&
						!form.content.valid &&
						form.content.value.length > 0 ? (
							<p className="Red d-block text-center m-auto Font6">
								Content must be less than 350 characters
							</p>
						) : null}
					</div>
				</div>
				{props.auth ? (
					<React.Fragment>
						{addComment ? (
							<button
								className="Button Grey-BG DarkBlue mb-3 Bungee"
								disabled={!formValidity}
								style={{marginTop:"-20px"}}
							>
								Submit
							</button>
						) : null}
					</React.Fragment>
				) : (
					<button
						className="Button mt-3 Grey-BG DarkBlue mb-3 Bungee"
						type="button"
						onClick={() => props.history.push("/login")}
					>
						Login to add a comment
					</button>
				)}
			</form>
			{addComment ? null : (
							<button
								className="Button DarkBlue-BG d-block mt-4 mb-3 mx-auto Bungee Grey"
								type="button"
								onClick={() => setComment(true)}
							>
								Add A Comment
							</button>
						)}
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		auth: state.auth.token !== null,
		name: state.auth.userData.firstName || null,
		token: state.auth.token || null,
		userId: state.auth.userData._id || null,
		commentAdded: state.news.newComment,
		error: state.news.error,
		admin:state.auth.userData.admin};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFormSubmit: (formData, id, token) =>
			dispatch(actions.addComment(formData, id, token)),
		onDeleteComment: (token, userId, id) =>
			dispatch(actions.deleteComment(token, userId, id)),
		onResetComment: () => dispatch(actions.resetComment()),
		onUpdateUserData: (data, locator) =>
			dispatch(actions.updateUserData(data, locator)),
		onClearNewsError: () => dispatch(actions.clearNewsError()),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(Comments));
