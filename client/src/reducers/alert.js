import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

// The function takes a state and an action
// Action contains a type and a payload (data), you evaluate the type
function alertReducer(state = initialState, action) {
	// Destructure
	const { type, payload } = action;

	switch (type) {
		case SET_ALERT:
			// Since state is immutable, include one that exists
			// Then we can add our alert
			return [...state, payload];
		case REMOVE_ALERT:
			// Remove all alerts except the one that matches payload
			return state.filter((alert) => alert.id !== payload);
		default:
			return state;
	}
}

export default alertReducer;
