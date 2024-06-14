import * as actions from '../actions/actionTypes';

const initialState = {
    token: null,
    loading: false,
    error: null,
    verificationError: null,
    userData: {
        firstName: '',
        active: false,
        admin: false,
    },
};

const updateData = (state, action) => {
    const user = { ...state.userData };
    user[action.payload.locator].push(action.payload.data);
    return { ...state, userData: user };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.AUTH_START:
            return { ...state, loading: true, error: null };
        case actions.AUTH_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
                token: action.payload.token,
                userData: action.payload.userData,
                expirationTime: action.payload.expirationTime,
            };
        case actions.AUTH_FAIL:
            return { ...state, error: action.payload.error, loading: false };
        case actions.LOGOUT:
            return {
                ...state,
                error: null,
                userData: { firstName: '', active: false },
                token: null,
                expirationTime: null,
                loading: false,
            };
        case actions.CLEAR_AUTH_ERROR:
            return { ...state, error: null };
        case actions.UPDATE_USER_DATA:
            return updateData(state, action);
        case actions.VERIFY_START:
            return { ...state, loading: true, verificationError: null };
        case actions.VERIFY_SUCCESS:
            const newUser = { ...state.userData, active: true };
            return { ...state, userData: newUser, verificationError: null };
        case actions.VERIFY_FAIL:
            return { ...state, verificationError: action.payload.error, loading: false };
        default:
            return state;
    }
};

export default reducer;
