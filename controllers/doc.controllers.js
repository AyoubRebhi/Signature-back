const docModels = require("../models/doc.models");
let multer = require('multer');
const createDoc = async (req, res) => {
	const newDoc = new docModels({
		// name: req.body.name,
		// owners: req.verifiedUser._id
	});
	try {
		const savedDoc = await newDoc.save();
		return res.status(200).json(savedDoc);
	} catch (err) {
		return res.status(500).json(err);
	}
};

const getDocs = async (req, res) => {
	try {
		const docs = await docModels.find();
		return res.status(200).json(docs);
	} catch (err) {
		return res.status(500).json(err);
	}
};
const getDoc = async (req, res) => {
	const id = req.params.docId;

	try {
		const doc = await docModels.findById(id);
		return res.status(200).json(doc);
	} catch (err) {
		return res.status(500).json(err);
	}
};
const deleteDoc = async (req, res) => {
	const id = req.params.docId;
	try {
		const doc = await docModels.findByIdAndDelete(id);
		return res.status(200).json(doc);
	} catch (err) {
		return res.status(500).json(err);
	}
};
const updateDoc = async (req, res) => {
	const id = req.params.docId;
	try {
		const doc = await docModels.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		return res.status(200).json(doc);
	} catch (err) {
		return res.status(500).json(err);
	}
};

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".jpg")
    }
});
const maxSize = 1 * 1000 * 1000;

let upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        let filetypes = /jpeg|jpg|png|pdf/;
        let mimetype = filetypes.test(file.mimetype);
  
        let extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      } 
  
// mypic is the name of file attribute
}).single("mypic"); 

const DocU = (req, res) =>{
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
		console.log("req",req)
  
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.json({
				status:"FAILED",
				message:"An error occured while uploading file!"
			})
        }
        else {
  
            // SUCCESS, file successfully uploaded
            res.json({
				status:"SUCCESS",
				message:"File successfully uploaded!"
			})
        }
    })
}
   
module.exports.createDoc = createDoc;
module.exports.getDocs = getDocs;
module.exports.getDoc = getDoc;
module.exports.deleteDoc = deleteDoc;
module.exports.updateDoc = updateDoc;
module.exports.DocU=DocU;