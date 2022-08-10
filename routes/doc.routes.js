const {
	createDoc,
	getDoc,
	getDocs,
	updateDoc,
	deleteDoc,
} = require('../controllers/doc.controllers');
const docModel = require('../models/doc.models');
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

	if(req.files) {
		console.log(req.files);
		var file= req.files.file;
		var filename= file.name;
		console.log(filename);
		doc= new Doc(data);
	    doc.save();
	    file.mv('./uploads/'+ filename,function(err){
			if (err) {
				res.send(err)
			}
			else{
				res.send("file uploaded successfully ")
			}
		})     
	}

})
router.post("/create", createDoc);
router.get("/getall", getDocs);
router.get("/get", getDoc);
router.put("/upldate", updateDoc);
router.delete("/delete", deleteDoc);

module.exports = router;