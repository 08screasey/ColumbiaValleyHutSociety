import * as actions from "./actionTypes";
import axios from "axios";

export const auth = (userData, signUp) => {
	return (dispatch) => {
		dispatch(authStart());
		let url = "/api/users/login";
		if (signUp) {
			url = "/api/users/register";
		}
		axios
			.post(url, userData)
			.then((res) => {localStorage.setItem("userId", res.data.userData._id);
				localStorage.setItem("token", res.data.token);
				localStorage.setItem("expDate", new Date(Date.now() + 3600000));
				dispatch(authSuccess(res.data));
				dispatch(startAuthTimeOut(3600000));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(authFail(error));
			});
	};
};

export const initAuthCheck = () => {
	return (dispatch) => {
		const token = localStorage.getItem("token");
		const expDate = localStorage.getItem("expDate");
		if (!token || Date.parse(expDate) < Date.parse(new Date())) {
			dispatch(logout());
		} else {
			const difference = +Date.parse(expDate) - Date.parse(new Date());
			axios
				.get("/api/users/data", {
					headers: {
						"x-auth-token": token,
					},
				})
				.then((res) => {
					dispatch(authSuccess({userData:res.data, token:token}));
					dispatch(startAuthTimeOut(difference));
				})
				.catch((err) => {
					let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				} 
				dispatch(logout())
				dispatch(authFail(error))
				});
		}
	};
};

export const startAuthTimeOut = (expTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logout());
		}, expTime);
	};
};

export const authFail = (error) => {
	return {
		type: actions.AUTH_FAIL,
		payload: {
			error: error,
		},
	};
};

export const authSuccess = (userData) => {
	const admin = userData.userData._id === "5f32e85f17bc722350c0bdca" ? true : false;
	return {
		type: actions.AUTH_SUCCESS,
		payload: {
			userData: {...userData.userData, admin:admin}, token: userData.token}
		}
	};

export const authStart = () => {
	return {
		type: actions.AUTH_START,
	};
};

export const logout = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("userId");
	localStorage.removeItem("expDate");
	return { type: actions.LOGOUT };
};

export const clearAuthError = () => {
	return { type: actions.CLEAR_AUTH_ERROR };
};

export const updateUserData = (data, locator) => {
	return{ type: actions.UPDATE_USER_DATA,
			payload:{data, locator}}
}

export const verifyEmail = (hash) => {
	return dispatch => {
		verifyStart();
		axios.post("/api/users/verify", {hash:hash})
		.then(res=>{
			dispatch(verifySuccess())
		})
		.catch(err=>{
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(verifyFail(error))
		})
	}

}

const verifySuccess = () => {
	return {type: actions.VERIFY_SUCCESS}
}

const verifyFail = (error) => {
	return {type:actions.VERIFY_FAIL, payload:{error:error}}
}

export const reVerify = (id, token) => {
	return dispatch => {
		axios.get('/api/users/verify/'+id, {headers: {
						"x-auth-token": token,
					}})
		.then(res=>{dispatch(verifySuccess())
		}).catch(err=>{
			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(verifyFail(error))
		})
	}
}

const verifyStart = () => {
	return {
		type: actions.VERIFY_START
	}
}
