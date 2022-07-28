const {
	createDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
} = require("../controllers/doc.controllers");
const docModel = require("../models/doc.models");
const router = require("express").Router();

router.param("doc", async (req, res, next, id) => {
	try {
		const doc = await docModel.findById(id);

		if (!doc) {
			return res.status(404).json("doc not found");
		}

		req.doc = doc;
		next();
	} catch (err) {
		return res.status(500).json(err);
	}
});

router.post("/", createDoc);
router.get("/", getDocs);
router.get("/:doc", getDoc);
router.put("/:doc", updateDoc);
router.delete("/:doc", deleteDoc);

module.exports = router;