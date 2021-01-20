/*
    Registering Users
    & Validation
*/
const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
	"/",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		// If there's an error, send back 400 bad request
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;

		try {
			// See if user exists
			let user = await User.findOne({ email });

			if (user) {
				return res.status(400).json({ errors: [{ msg: "User already exists" }] });
			}

			// Get users gravatar
			const avatar = gravatar.url(email, {
				s: "200", // Size
				r: "pg", // Rating
				d: "mm", // Default img
			});

			user = new User({
				name,
				email,
				avatar,
				password,
			});

			// Encrypt password (bcrypt)
			// (10) is recommended. Higher is more secure, but also slower
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);

			await user.save();

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
