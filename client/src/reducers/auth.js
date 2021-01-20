import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	USER_LOADED,
	AUTH_ERROR,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	ACCOUNT_DELETED,
} from "../actions/types";

// Set initialState
const initialState = {
	token: localStorage.getItem("token"),
	isAuthenticated: null,
	loading: true,
	user: null,
};

// Create the actual function
function authReducer(state = initialState, action) {
	// Destructure
	const { type, payload } = action;

	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload, // Everything but the payload
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem("token", payload.token);
			// State is immutable, so ...state first
			return {
				...state,
				...payload,
				isAuthenticated: true,
				loading: false, // Done loading
			};
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
		case ACCOUNT_DELETED:
			// We never want a token that isn't valid, in localStorage
			localStorage.removeItem("token");
			return {
				...state,
				token: null,
				isAuthenticated: false,
				loading: false,
			};
		default:
			return state;
	}
}

export default authReducer;
