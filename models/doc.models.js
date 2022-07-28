const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema({
	IDfile:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    }
},
{timestamps: true}
);

module.exports = mongoose.model("Student", DocSchema);
