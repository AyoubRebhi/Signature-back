const docModels = require("../models/doc.models");

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

const uploadDoc = async(req,res)=> {
	
}

module.exports.createDoc = createDoc;
module.exports.getDocs = getDocs;
module.exports.getDoc = getDoc;
module.exports.deleteDoc = deleteDoc;
module.exports.updateDoc = updateDoc;