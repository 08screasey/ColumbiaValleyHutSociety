import * as actions from "./actionTypes";
import axios from "axios";

export const fetchNews = () => {
	return (dispatch) => {
		dispatch(fetchNewsStart());
		axios.get("/api/news")
			.then((res) => {
				dispatch(fetchNewsSuccess(res.data));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(fetchNewsFail(error));
			});
	};
};

const fetchNewsStart = () => {
	return { type: actions.FETCH_NEWS_START };
};

const fetchNewsSuccess = (news) => {
	return {
		type: actions.FETCH_NEWS_SUCCESS,
		payload: {
			updates: news,
		},
	};
};

const fetchNewsFail = (err) => {
	return {
		type: actions.FETCH_NEWS_FAIL,
		payload: {
			error: err,
		},
	};
};

export const addNews = (newsPost, token) => {
	return (dispatch) => {
		dispatch(addNewsStart());
		axios
			.post("/api/news",
				newsPost
			, {headers:{"x-auth-token":token}})
			.then((res) => {
				dispatch(addNewsSuccess(res.data));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(addNewsFail(error));
			});
	};
};

const addNewsStart = () => {
	return { type: actions.ADD_NEWS_START };
};

const addNewsSuccess = (news) => {
	return {
		type: actions.ADD_NEWS_SUCCESS,
		payload: {
			update: news,
		},
	};
};

const addNewsFail = (err) => {
	return {
		type: actions.ADD_NEWS_FAIL,
		payload: {
			error: err,
		},
	};
};

export const updateNews = (id, newsPost, token) => {
	return (dispatch) => {
		dispatch(updateNewsStart());
		axios
			.put("/api/news/" + id, {
				post: newsPost,
			}, {headers: {
					"x-auth-token": token}
				})
			.then((res) => {
				dispatch(updateNewsSuccess(res.data));
			})
			.catch((err) => {
				let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
				dispatch(updateNewsFail(error));
			});
	};
};

const updateNewsStart = () => {
	return { type: actions.UPDATE_NEWS_START };
};

const updateNewsSuccess = (news) => {
	return {
		type: actions.UPDATE_NEWS_SUCCESS,
		payload: {
			update: news,
		},
	};
};

const updateNewsFail = (err) => {
	return {
		type: actions.UPDATE_NEWS_FAIL,
		payload: {
			error: err,
		},
	};
};

export const clearUpdate = () => {
	return {
		type:actions.CLEAR_UPDATE
	}
}

export const deleteNews = (id, userData, token) => {
	return (dispatch) => {
		dispatch(deleteNewsStart());
		axios
			.delete("/api/news/" + id, {
				data: { userData: userData },
				headers: {
					"x-auth-token": token}
				
			})
			.then((res) => {
				dispatch(deleteNewsSuccess(res.data._id))
			})
			.catch((err) => {
				dispatch(deleteNewsFail(err));
			});
	};
};

const deleteNewsStart = () => {
	return { type: actions.DELETE_NEWS_START };
};

const deleteNewsSuccess = (id) => {
	return {
		type: actions.DELETE_NEWS_SUCCESS,
		payload: {
			deletedId: id,
		},
	};
};

const deleteNewsFail = (err) => {
	return {
		type: actions.DELETE_NEWS_FAIL,
		payload: {
			error: err,
		},
	};
};

export const addComment = (formData, id, token) => {
	return (dispatch) => {
		dispatch(addCommentStart());
		axios.put("/api/comments/" + id, formData, {headers: {
					"x-auth-token": token}
				})
		.then(res=>{
			dispatch(addCommentSuccess(res, formData, id))
		})
		.catch((err)=>{
			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
			dispatch(addCommentFail(error))
		})	}
} 

const addCommentSuccess = (res, id) => {
	return {type: actions.ADD_COMMENT_SUCCESS, payload:{comment:res.data.comment, updateId:id}}
}

const addCommentFail = (err) => {
	return {type: actions.ADD_COMMENT_FAIL,
		payload:{
			error:err
		}}
}
const addCommentStart = (res) => {
	return {type: actions.ADD_COMMENT_START}
}

export const deleteComment = (token, articleId, comment) => {
	return (dispatch) => {
		dispatch(deleteCommentStart());
		axios.delete(`/api/comments/${articleId}/${comment._id}`, {headers: {
					"x-auth-token": token}
				})
		.then(res=>{
			dispatch(deleteCommentSuccess(res))
		})
		.catch((err)=>{
			let error = {status:"Error: 500", message:"Looks like we're having some trouble."};
				if(err.response){
					error = {status: err.response.status, message:err.response.data}
				}
			dispatch(deleteCommentFail(error))
		})	}
} 

const deleteCommentSuccess = (res, formData, id) => {
	return {type: actions.DELETE_COMMENT_SUCCESS}
}

const deleteCommentFail = (err) => {
	return {type: actions.DELETE_COMMENT_FAIL,
		payload:{
			error:err
		}}
}
const deleteCommentStart = (res) => {
	return {type: actions.DELETE_COMMENT_START}
}

export const resetComment = () => {
	return {type:actions.RESET_COMMENT}
}

export const clearNewsError = () => {
	return {type:actions.CLEAR_NEWS_ERROR}
}
