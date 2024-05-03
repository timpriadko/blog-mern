import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import {
	registerValidation,
	loginValidations,
	postCreateValidation,
} from "./validations/validations.js";

import { checkAuth, handleValidationErrors } from "./utils/index.js";

import { UserController, PostController } from "./controllers/index.js";

mongoose
	.connect(
		"mongodb+srv://timpriadko:LVMw2VeE9u21UBqe@cluster0.b3bpude.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => console.log("DB ok"))
	.catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, "uploads");
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.post(
	"/auth/login",
	loginValidations,
	handleValidationErrors,
	UserController.login
);
app.post(
	"/auth/register",
	registerValidation,
	handleValidationErrors,
	UserController.register
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get("/posts", PostController.getAll);
app.get("/posts/:id", PostController.getOne);
app.post(
	"/posts",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.create
);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
	"/posts/:id",
	checkAuth,
	postCreateValidation,
	handleValidationErrors,
	PostController.update
);

app.listen(4444, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log("Server OK");
});
