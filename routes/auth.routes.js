const {
	login,
	emailVerification,
	forgotPassword,
	resetPassword,
	signup
} = require("../controllers/auth.controllers");

const router = require("express").Router();


router.post("/signup",signup);
router.post("/requestPasswordReset", resetPassword)
router.post("/login", login);
router.get("/verify", emailVerification);
router.post("/forgot", forgotPassword);
router.post("/reset", resetPassword);
module.exports = router;