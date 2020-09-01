import * as actions from "../actions/actionTypes";

const initialState = {
	accessUpdates: [],
	loading: false,
	error: null,
	newComment:null,
	newUpdate:false
};

const newsStart = (state, action) => {
	return { ...state, loading: true, error: null };
};
const newsSuccess = (state, action) => {
	return {
		...state,
		loading: false,
		error: null,
		accessUpdates: action.payload.updates,
	};
};
const newsFail = (state, action) => {
	return { ...state, loading: false, error: action.payload.error };
};

const updateNewsSuccess = (state, action) => {
	const newAccessUpdates = state.accessUpdates.map(update=>{
		return update._id === action.payload.update._id ? action.payload.update : update
	});
	
	return {...state, accessUpdates: newAccessUpdates, error:null, loading:false, newUpdate:true}

}

const deleteNewsSuccess = (state, action) => {
	const newAccessUpdates = state.accessUpdates.filter(update=>update._id !== action.payload.deletedId);
	return {...state, accessUpdates:newAccessUpdates, error:null, loading:false}
}

const commentSuccess = (state, action) => {
	const comment = {...action.payload.comment}
	const newsArticles = state.accessUpdates.map((update)=>{

		if(update._id === action.payload.updateId){
			update.comments.push(comment)
		}
		return update
	})
	return {...state, loading:false, error:null, accessUpdates:newsArticles, newComment:action.payload.comment}
}

const addNewsSuccess = (state, action) => {
	const updates = [...state.accessUpdates];
	updates.push(action.payload.update);
	return {...state, loading:false, accessUpdates:updates, error:null, newUpdate:true}
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.FETCH_NEWS_START:
			return newsStart(state, action);
		case actions.FETCH_NEWS_SUCCESS:
			return newsSuccess(state, action);
		case actions.FETCH_NEWS_FAIL:
			return newsFail(state, action);
		case actions.ADD_NEWS_START:
			return newsStart(state, action);
		case actions.ADD_NEWS_SUCCESS:
			return addNewsSuccess(state, action);
		case actions.ADD_NEWS_FAIL:
			return newsFail(state, action);
		case actions.UPDATE_NEWS_START:
			return newsStart(state, action);
		case actions.UPDATE_NEWS_SUCCESS:
			return updateNewsSuccess(state, action);
		case actions.UPDATE_NEWS_FAIL:
			return newsFail(state, action);
		case actions.CLEAR_UPDATE:
			return {...state, newUpdate:false};
		case actions.DELETE_NEWS_START:
			return newsStart(state, action);
		case actions.DELETE_NEWS_SUCCESS:
			return deleteNewsSuccess(state, action);
		case actions.DELETE_NEWS_FAIL:
			return newsFail(state, action);
		case actions.ADD_COMMENT_START:
			return newsStart(state, action);
		case actions.ADD_COMMENT_SUCCESS:
			return commentSuccess(state, action);
		case actions.ADD_COMMENT_FAIL:
			return {...state, loading:false, error:action.payload.error};
		case actions.RESET_COMMENT:
			return {...state, newComment:null, error:null};
		case action.CLEAR_NEWS_ERROR:
			return {...state, error:null}
		default:
			return state;
	}
};

export default reducer;
