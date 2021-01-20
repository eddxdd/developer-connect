import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../../actions/auth";

const Login = ({ login, isAuthenticated }) => {
	// React Hook
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	// Destructuring
	const { email, password } = formData;

	// Associate the input with a name
	// Use spread operator ... to make a copy of formData, then change the name to the input value
	// We also use [e.target.name] to target the value of the name attribute
	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		login(email, password);
	};

	// If we're authenticated, redirect
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<i className="fas fa-user" /> Sign Into Your Account
			</p>
			<form className="form" onSubmit={(e) => onSubmit(e)}>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						value={password}
						onChange={(e) => onChange(e)}
						minLength="6"
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<p className="my-1">
				Don't have an account? <Link to="/register">Sign Up</Link>
			</p>
		</Fragment>
	);
};

Login.propTypes = {
	login: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

// Get auth state (then, line 27)
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { login })(Login);
