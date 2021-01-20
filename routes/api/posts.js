const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post("/", [auth, [check("text", "Text is required").not().isEmpty()]], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		// Since this is private, we are logged in, which means we can use the token with req.user.id
		// Since we do not want to send the password back, do -password
		const user = await User.findById(req.user.id).select("-password");

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		});

		// Once we add the post, we get it back in the response
		const post = await newPost.save();

		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get("/", auth, async (req, res) => {
	try {
		const posts = await Post.find().sort({ date: -1 });
		res.json(posts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
router.get("/:id", auth, async (req, res) => {
	try {
		// Let's get the ID from the URL
		const post = await Post.findById(req.params.id);

		// Check for ObjectId format and post
		if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		res.json(post);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check for ObjectId format and post
		if (!req.params.id.match(/^[0-9a-fA-F]{24}$/) || !post) {
			return res.status(404).json({ msg: "Post not found" });
		}

		// Check if user matches the user that's logged in
		if (post.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// If OK, then remove
		await post.remove();

		res.json({ msg: "Post removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put("/like/:id", auth, async (req, res) => {
	try {
		// Get the ID from the URL
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		// Compare if the user clicking like is the user logged in, and if > 0
		if (post.likes.filter((like) => like.user.toString() === req.user.id).length > 0) {
			return res.status(400).json({ msg: "Post already liked" });
		}

		// Let's insert it in the beginning
		post.likes.unshift({ user: req.user.id });

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    PUT api/posts/unlike/:id
// @desc     Unlike a post
// @access   Private
router.put("/unlike/:id", auth, async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		// Check if the post has already been liked
		if (post.likes.filter((like) => like.user.toString() === req.user.id).length === 0) {
			return res.status(400).json({ msg: "Post has not yet been liked" });
		}

		// Get remove index
		// For each like, return the user ID, so that we can remove the correct like
		const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id);

		post.likes.splice(removeIndex, 1);

		await post.save();

		res.json(post.likes);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    POST api/posts/comment/:id
// @desc     Comment on a post
// @access   Private
router.post("/comment/:id", [auth, [check("text", "Text is required").not().isEmpty()]], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const user = await User.findById(req.user.id).select("-password");
		const post = await Post.findById(req.params.id);

		// No need to instantiate since it's not a collection, just plain old object
		const newComment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id,
		};

		// Let's add it to the beginning
		post.comments.unshift(newComment);

		await post.save();

		// Send back all the comments as a response
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
	try {
		// Get the post by ID
		const post = await Post.findById(req.params.id);

		// Get the comment from the post
		const comment = post.comments.find((comment) => comment.id === req.params.comment_id);

		// Make sure comment exists
		if (!comment) {
			return res.status(404).json({ msg: "Comment does not exist" });
		}

		// Check if the user removing it is the user logged in
		if (comment.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Get remove index
		const removeIndex = post.comments.map((comment) => comment.id).indexOf(req.params.comment_id);

		// Remove post, then save
		post.comments.splice(removeIndex, 1);

		await post.save();

		// Return all the comments as response
		res.json(post.comments);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @TODO: Edit a comment

module.exports = router;
