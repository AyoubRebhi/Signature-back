const {
	createUser,
	getUser,
	getUsers,
	updateUser,
	deleteUser,
} = require("../controllers/user.controllers");
const userModel = require("../models/user.models");
const router = require("express").Router();

router.param("user", async (req, res, next, id) => {
	try {
		const user = await userModel.findById(id);

		if (!user) {
			return res.status(404).json("user not found");
		}

		req.user = user;
		next();
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.post("/create", createUser);
router.get("/getall", getUsers);
router.get("/get", getUser);
router.put("/update", updateUser);
router.delete("/delete", deleteUser);

module.exports = router;