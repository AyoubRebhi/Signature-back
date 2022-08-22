const User = require("../models/user.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const { REGISTER_ASYNC_USER } = require("../constants");
const crypto = require("crypto");
const transporter = require("../utils/nodemailer");
const Redis = require("ioredis");
const { Console } = require("console");


const signup=(req,res)=>{
	console.log(req.body);
	const{email,username,password}=req.body;
    User.findOne({email}).exec((err,user)=>{
		if(user){
			return res.status(422).json("L'e-mail existe déjà");
		}
		let newUser=new User({email,username,password});
		newUser.save((err,sucess)=>{
			if(err){
				console.log("there s an error in signup:",err);
			}
			res.status(202).json("Compte créé avec succès");
		})

	})
}

const login = async (req, res) => {
	let existUser = null;
	try {
		if (isEmail(req.body.loginInfo)) {
			existUser = await userModels.findOne({ email: req.body.loginInfo });
		} else {
			existUser = await userModels.findOne({ username: req.body.loginInfo });
		}

		if (!existUser) {
			return res.status(401).json("Faux e-mail/mot de passe");
		}

		const validPassword = await bcrypt.compare(
			req.body.password,
			existUser.password
		);

		if (!validPassword) {
			return res.status(401).json("Faux e-mail/mot de passe");
		}
		const token = jwt.sign(
			{
				_id: existUser._id,
				email: existUser.email,
				username: existUser.username,
				isAdmin: existUser.isAdmin,
			},
			process.env.TOKEN_KEY,
			{ expiresIn: "2 days" }
		);
		existUser.lastLogin = Date.now();
		await existUser.save();
		return res.status(200).json({ user: existUser, token: token });
	} catch (err) {
		return res.status(500).json(err);
	}
};

const emailVerification = async (req, res) => {
	if (!req.query.token) {
		return res.status(400).json("jeton invalide");
	}
	try {
		const verifiedEmail = jwt.verify(
			req.query.token,
			process.env.EMAIL_TOKEN_KEY
		);
		const user = await userModels.findByIdAndUpdate(
			verifiedEmail._id,
			{ isEmailVerified: true },
			{ new: true }
		);
		return res.status(200).json(user);
	} catch (err) {
		return res.status(400).json("jeton invalide");
	}
};

const resetPassword = async (req, res) => {
	if (!req.body.code) {
		return res.status(400).json("jeton invalide");
	}
	const email = await redisIO.get(req.body.code);
	if (!email) {
		return res.status(400).json("demander un nouveau code, votre est invalide");
	}
	try {
		const salt = await bcrypt.genSalt(16);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);

		const user = await userModels.findOneAndUpdate(
			{ email: email },
			{ password: hashedPassword },
			{ new: true }
		);
		return res.status(200).json(user);
	} catch (err) {
		return res.status(500).json(err);
	}
};

const forgotPassword = async (req, res) => {
	try {
		const existUser = await userModels.findOne({ email: req.body.email });

		if (!existUser) {
			return res
				.status(202)
				.json("Si votre email existe dans la base de données, vous obtiendrez un lien de réinitialisation du mot de passe");
		}
		const code = crypto
			.randomBytes(Math.ceil(6 / 2))
			.toString("hex") // convert to hexadecimal format
			.slice(0, 6)
			.toUpperCase();

		redisIO.set(code, existUser.email, "ex", 3600);

		await transporter.sendMail({
			from: "ayoubrebhi1230@gmail.com", // sender address
			to: existUser.email, // list of receivers
			subject: "réinitialiser le mot de passe ✔", // Subject line
			text: "Vous voulez réinitialiser votre mot de passe , ce ci votre code de verification", // plain text body
			html: `Ce ci votre code: ${code}`, // html body
		});
		return res
			.status(202)
			.json("Si votre email existe dans la base de données, vous obtiendrez un lien de réinitialisation du mot de passe");
	} catch (err) {
		return res.status(500).json(err);
	}
};


module.exports.forgotPassword = forgotPassword;
module.exports.emailVerification = emailVerification;
module.exports.signup = signup;
module.exports.login = login;
module.exports.resetPassword = resetPassword;