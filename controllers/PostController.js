import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate("user").exec();

		res.json(posts);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Posts fetch is failed",
		});
	}
};

export const getOne = async (req, res) => {
	try {
		const postId = req.params.id;

		const updatedPost = await PostModel.findOneAndUpdate(
			{
				_id: postId,
			},
			{
				$inc: { viewsCount: 1 },
			},
			{
				new: true, // Return the updated document
			}
		);

		if (!updatedPost) {
			return res.status(404).json({
				message: "The post is not found",
			});
		}

		res.json(updatedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Post fetch is failed",
		});
	}
};

export const remove = async (req, res) => {
	try {
		const postId = req.params.id;

		const deletedPost = await PostModel.findOneAndDelete({
			_id: postId,
		});

		if (!deletedPost) {
			return res.status(404).json({
				message: "The post is not found",
			});
		}

		res.json(deletedPost);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "Post fetch is failed",
		});
	}
};

export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			imageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		});

		const post = await doc.save();

		res.json(post);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "The post creation is failed",
		});
	}
};

export const update = async (req, res) => {
	try {
		const postId = req.params.id;

		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				imageUrl: req.body.imageUrl,
				tags: req.body.tags,
				user: req.userId,
			}
		);

		res.json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			message: "The post update is failed",
		});
	}
};
