const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		firstName: { type: String, maxlength: 128 },
		lastName: { type: String, maxlength: 128 },
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		password: { type: String, required: true, maxlength: 4096 },
		lastLogin: { type: Date, default: Date.now },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);