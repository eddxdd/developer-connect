import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map((alert) => (
		// When mapping through an array, it outputs a .jsx list
		// It requires an unique key
		<div key={alert.id} className={`alert alert-${alert.alertType}`}>
			{alert.msg}
		</div>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired,
};

// Get the alert state
const mapStateToProps = (state) => ({
	alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
