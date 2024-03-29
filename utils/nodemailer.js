const nodemailer = require("nodemailer");
require("dotenv").config();
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.AUTH_EMAIL,
		pass: process.env.AUTH_PASS, // naturally, replace both with your real credentials or an application-specific password
	},
});

module.exports = transporter;