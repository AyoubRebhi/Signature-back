const {
	createDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
	DocU,
} = require('../controllers/doc.controllers');
const docModels = require('../models/doc.models');
const Doc = require('../models/doc.models');
const router = require('express').Router();

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
router.get('/upload',(req,res)=>{
	res.render('upload.ejs',)
	res.sendFile(__dirname +'/views/upload.ejs')
	console.log(req.files);
})

router.post('/upload', function(req, res) {
	//console.log("user");

	if(req) {
        let {url,name} = req.body;
		doc = new Doc();
		doc.name=name;
		doc.url=url;
	    doc.save();     
	}

})

router.post("/docupload",DocU);
router.post("/create", createDoc);
router.get("/getall", getDocs);
router.get("/get", getDoc);
router.put("/upldate", updateDoc);
router.delete("/delete", deleteDoc);

module.exports = router;