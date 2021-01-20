import { v4 as uuidv4 } from "uuid";
import { SET_ALERT, REMOVE_ALERT } from "./types";

// Use dispatch to dispatch more than one action.type from function
export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
	const id = uuidv4(); // Get a random universal ID
	dispatch({
		type: SET_ALERT,
		payload: { msg, alertType, id },
	});

	setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
