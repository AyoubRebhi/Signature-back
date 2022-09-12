//mondodb variables
const User = require("../models/user.models");
const UserVerification = require("../models/userVerification");
const PasswordReset= require("../models/passwordReset");
//email handler
const nodemailer=require("../node_modules/nodemailer");
//unique String
const {v4: uuidv4 } = require('uuid');
//to use env variables
require('dotenv').config();
//path
const path =require("path");
//nodemailer stuff 
// const transporter = nodemailer.createTransport(config.mailerOptions);

// const transporter = require("../utils/nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const isEmail = require("validator/lib/isEmail");
const { REGISTER_ASYNC_USER } = require("../constants");
const crypto = require("crypto");
const { Console, error } = require("console");

//testig success
// Generate SMTP service account from ethereal.email
// nodemailer.createTestAccount((err, account) => {
//     if (err) {
//         console.error('Failed to create a testing account');
//         console.error(err);
//         return process.exit(1);
//     }

//     console.log('Credentials obtained, sending message...');

//     // Create a SMTP transporter object
//     let transporter = nodemailer.createTransport(
//         {
//             host: account.smtp.host,
//             port: account.smtp.port,
//             secure: "gmail",
//             auth: {
// 						user:process.env.AUTH_EMAIL,
// 				 		pass:process.env.AUTH_PASS,
// 				 	},
//             logger: true,
//             transactionLog: false, // include SMTP traffic in the logs
//             allowInternalNetworkInterfaces: false
//         },
		
        
//     );
// })

let transporter=nodemailer.createTransport({
	service:"Gmail",
	host:"localhost",
	port: 25,
	tls: {
		rejectUnauthorized: false
	},	
})
transporter.verify((error,success)=>{
 	if(error){
 		console.log(error);
 	}else {
 		console.log("Ready for messages");
 		console.log(success);
 	}
})

//1
//signup user
const signup=(req,res)=>{
	console.log(req.body);
	let{email,username,password}=req.body;
	

	if(email==""||username==""||password==""){
		res.json({
			status:"FAILED",
			message:"Empty input filds!"
		})
	}else if (password.length<8){
		res.json({
			status:"FAILED",
			message:"Password is too short"
		})
	}else{
        User.find({email}).then(result =>{
			if(result.length){
				//a user already exists
				res.json({
					status:"FAILED",
					message:"User already exist"
				})
			}else{
				//try to create new user
				const saltRounds=10;
				bcrypt.hash(password,saltRounds)
				    .then(hashedPassword =>{
						const newUser= new User({
							email,
							username,
							password: hashedPassword,
							verified:false
						});
						newUser
						    .save().then(result=>{
								//handle account verification
								sendVerificationEmail(result,res);
							})
							.catch(err=>{
								console.log(err);
								res.json({
									status:"FAILED",
									message:"An error occured while saving user account!"
								})
							})
					})
					.catch(err=>{
						console.log(err);
						res.json({
							status:"FAILED",
							message:"An error occured while hashing password!"
						})
					})
			}
	    }).catch(err=>{
			console.log(err);
			res.json({
				status:"FAILED",
				message:"An error occured while checking exiting user!"
			})
		})
	}
}

//send verification email
const  sendVerificationEmail=({_id,email}, res)=>{
	//url to be used in the email
	const currentUrl="http://localhost:5000/";

	const uniqueString = uuidv4 + _id;

	//mail options setup
	const mailOptions={
		from: process.env.AUTH_EMAIL,
		to: email,
		subject: "Verify your Email",
		html:`<p>Verify your Email adress to complete you signup and login into your account.</p>
			  <p>this link <b>expire in 6 hours</b> </p>
			  `

	};
	console.log(mailOptions);
	//hash the uniqueString
	const saltRounds=10;
	bcrypt
	    .hash(uniqueString,saltRounds)
		.then((hashedUniqueString)=>{
			//set values in userVerification colection
			const newVerification= new UserVerification({
				userId: _id,
				uniqueString: hashedUniqueString,
				createdAt: Date.now(),
				expiresAt: Date.now() + 21600000,
			});
			newVerification
			    .save()
			    .then(()=>{
					transporter
					    .sendMail(mailOptions)
						.then(()=>{
							//email sent and verification record saved
							res.json({
								status:"PENDING",
								message:"Verification Email sent!"
							})
						})
						.catch((error=>{
							console.log(error);
							res.json({
								status:"FAILED",
								message:"Verification email failed!"
							})
						}))
				})
				.catch((error)=>{
					console.log(error);
					res.json({
						status:"FAILED",
						message:"Could not save verification email data!"
					})
				})
		})
		.catch(()=>{
			res.json({
				status:"FAILED",
				message:"An error occured while hashing email data!"
			})
		})

};
//verify email


//2
//Reset password
const resetPassword = async(req,res)=>{
	const {email, redirectUrl}=req.body;
    //check if email exists
	User
	   .find({email})
	   .then((data)=>{
		if(data.length){
			//check if user is verified 
			
				//proceed with email tor reset password 
				sendResetEmail(data[0], redirectUrl, res);
			
		}else{
			res.json({
				status:"FAILED",
				message:"No account with the supplied email exists!"
			});
		}
	   })
	   .catch(error=>{
		console.log(error);
		res.json({
			status:"FAILED",
			message:"an error occurred while checking for existing user"
		});
	})
}
//send reset password email
const sendResetEmail=({_id, email}, redirectUrl, res )=>{
	const resetString= uuidv4+ _id;
	//we delete all existing reset records
	resetPassword
	    .deleteMany({userId: _id})
	    .then(result=>{
			//reset records successfully
			//now we send email 
			const mailOptions={
				from: process.env.AUTH_EMAIL,
				to: email,
				subject:" Reset Password ",
				html:`<p>We heard that you lost your password.</p>
				      <p>Don't worry use the link below to reset it.</p>
				      <p>this link <b>expire in 60 minutes</b> </p>
					  <p>Press <a href=${redirectUrl+"/"+ _id +"/" +resetString}>here </a>to proceed </p>`
			};
			//hash the reset string
			const saltRounds=10;
			bcrypt
			    .hash(resetString, saltRounds)
				.then(hashedResetString =>{
					//set values in password resetcollection
					const newPasswordReset= new PasswordReset({
						userId: _id,
						resetString: hashedResetString,
						createdAt: Date.now(),
						expireAt: Date.now()+3600000
					});
					newPasswordReset
					    .save()
						.then(()=>{
							transporter
							    .sendMail(mailOptions)
								.then(()=>{
									//reset email sent and password reset saved
									res.json({
										status:"PENDING",
										message:"password reset email sent"
									})
								})
								.catch(error=>{
									console.log(error);
									res.json({
										status:"FAILED",
										message:"Password reset email failed "
									});
								});
						})
						.catch(error=>{
							console.log(error);
					        res.json({
						        status:"FAILED",
						        message:"Could not save reset password "
					        });
						})
				})
				.catch(error=>{
					console.log(error);
					res.json({
						status:"FAILED",
						message:"An error occured while hashing password"
					});
				})
		})
	    .catch(error=>{
			//error while clearing 
			console.log(error);
			res.json({
				status:"FAILED",
				message:"clearing existing password reset records failed"
			});
		})
}
//3
//login
const login = async (req, res) => {
	let{email,password}=req.body;
	if(email==""||password==""){
		res.json({
			status:"FAILED",
			message:"Empty credentials supplied!"
		})
	}else{
		//check if user exist
		User.find({email})
		    .then((data) =>{
				if(data.length){
					//user exists
					const hashedPassword=data[0].password;
					bcrypt.compare(password,hashedPassword)
					    .then(result=>{
							if(result){
							    //password match
							    res.json({
								    status:"SUCCESS",
								    message:"Login successfully !",
								    data: data
							    })
								//////Edit AUTH gard
							}else{
								res.json({
									status:"FAILED",
									message:"Invalid password Entered!"
								})
							}
						})
						.catch(err=>{
							console.log(err);
							res.json({
								status:"FAILED",
								message:"An error occured while comparing passwords!"
							})
						})
				}else{
					res.json({
						status:"FAILED",
						message:"Invalid crendentials entered!"
					})
				}
			})
			.catch(err=>{
				res.json({
					status:"FAILED",
					message:"An error occured while checking exiting user!"
				})
			})
	}
};
//4
//User verification
const emailVerification = async (req, res) => {
	let { userId,uniqueString}=req.params;
	UserVerification
	    .find({userId})
	    .then((result)=>{
			if(result.length > 0){
				//user verification record exists 
				const {expiresAt}=result[0];

				//checking for expired link
				if(expiresAt <Date.now()){
					//record has been expired so we ve to delete it 
					UserVerification
					    .deleteOne({userId})
						.then()
						.catch((error)=>{
							console.log(error);
							let message="An error occured while deleting expired user!";
			                res.redirect(`/user/verified/error=true&message=${message}`);
						})
				}
			}else{
				//user verification record does not exist
				let message="Account record does not exist or has been verified already!";
			    res.redirect(`/user/verified/error=true&message=${message}`);
			}
		})
		.catch((error)=>{
			console.log(error);
		    let message="An error occured while checking for existing user verification!";
			res.redirect(`/user/verified/error=true&message=${message}`);
		})
}
//verified User
const verified = async (req,res)=>{

}


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