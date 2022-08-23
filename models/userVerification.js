const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserVerificationSchema=new Schema({
    userId: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
});

module.exports = mongoose.model("UserVerification", UserVerificationSchema);