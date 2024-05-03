import { body } from "express-validator";

export const registerValidation = [
	body("email").isEmail(),
	body("password").isLength({ min: 5 }),
	body("fullName").isLength({ min: 3 }),
	body("avatartUrl").optional().isURL(),
];

export const loginValidations = [
	body("email").isEmail(),
	body("password").isLength({ min: 5 }),
];

export const postCreateValidation = [
	body("title", "Enter the title").isLength({ min: 3 }).isString(),
	body("text", "Enter the post content").isLength({ min: 3 }).isString(),
	body("tags", "Wrong tags format (enter an array)").optional().isString(),
	body("imageUrl", "Wrong image link (enter an array)").optional().isString(),
];
