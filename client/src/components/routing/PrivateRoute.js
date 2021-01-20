import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// ...rest to get any other parameters that are passed in
const PrivateRoute = ({ component: Component, auth: { isAuthenticated, loading }, ...rest }) => (
	// We use a route, and add in a render prop to check if the user is not authenticated && not loading
	// If true, then redirect to login
	// If false (if they are authenticated), the component will load
	<Route
		{...rest}
		render={(props) => (!isAuthenticated && !loading ? <Redirect to="/login" /> : <Component {...props} />)}
	/>
);

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

// Pull in the state from the auth reducer
const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
