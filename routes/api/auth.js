/*
    JSON web token for authentication
*/

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password"); // Find user by ID, no password
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST api/auth
// @desc    Authenticate user & get token (log-in with users that are already in the db)
// @access  Public
router.post(
	"/",
	[check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
	async (req, res) => {
		const errors = validationResult(req);
		// If there's an error, send back 400 bad request
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email });

			if (!user) {
				return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			// Match user text password with encrypted password
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
			}

			// Return jsonwebtoken (in order to allow the user to login right away upon registering)
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(
				payload,
				config.get("jwtSecret"),
				{ expiresIn: 360000 }, // Expiration is optional/recommended. 3600s = 1 hour
				(err, token) => {
					if (err) throw err;
					res.json({ token }); // If no err, send token back to client
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
