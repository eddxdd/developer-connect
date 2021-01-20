import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register, isAuthenticated }) => {
	// React hook
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		password2: "",
	});

	// Destructuring
	const { name, email, password, password2 } = formData;

	// Associate the input with a name
	// Use spread operator ... to make a copy of formData, then change the name to the input value
	// We also use [e.target.name] to target the value of the name attribute
	const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			setAlert("Passwords do not match", "danger");
		} else {
			register({ name, email, password }); // We are pulling this from formData
		}
	};

	// If we're authenticated, redirect
	if (isAuthenticated) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Create Your Account
			</p>
			<form className="form" onSubmit={(e) => onSubmit(e)}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						value={email}
						onChange={(e) => onChange(e)}
						required
					/>
					<small className="form-text">
						This site uses Gravatar so if you want a profile image, use a Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						minLength="6"
						value={password}
						onChange={(e) => onChange(e)}
						required
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						minLength="6"
						value={password2}
						onChange={(e) => onChange(e)}
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
};

Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired,
	isAuthenticated: PropTypes.bool,
};

// Get auth state (then, line 34)
const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

// Export connect with setAlert, so that it's available within props (which we destructure on line 7)
export default connect(mapStateToProps, { setAlert, register })(Register);
