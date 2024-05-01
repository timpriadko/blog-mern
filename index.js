import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";

import UserModel from "./models/User.js";

mongoose
	.connect(
		"mongodb+srv://timpriadko:LVMw2VeE9u21UBqe@cluster0.b3bpude.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
// 	res.send('Hello World!');
// });

// app.post('/auth/login', (req, res) => {
// 	// todo - rm
// 	console.log(req.body)

// 	const token = jwt.sign({
// 		email: req.body.email,
// 		fullName: 'John Doe'
// 	}, 'secret123');

// 	res.json({
// 		success: true,
// 		token
// 	})
// })

app.post("/auth/register", registerValidation, async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array());
	}

	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	const doc = new UserModel({
		email: req.body.email,
		fullName: req.body.fullName,
		avatarUrl: req.body.avatarUrl,
		passwordHash,
	});

	const user = await doc.save();

	res.json(user);
});

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
