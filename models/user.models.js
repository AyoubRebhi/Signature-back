const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			index: true,
			lowercase: true,
		},
		username: {
			type: String,
			unique: true,
			lowercase: true,
			index: true,
			maxlength: 256,
		},
		password: { type: String, required: true, maxlength: 4096, minlength:8 },
		lastLogin: { type: Date, default: Date.now },
		isAdmin: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);