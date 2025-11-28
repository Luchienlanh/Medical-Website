import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    adminId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true, unique: true},
    adminName: {type: String, required: true},
    passWord: {type: String, required: true},
    address: {type: String},
    email: {type: String},
    phoneNum: {type: String},
    sex: {type: Boolean}
}, {timestamps: true});

export const Admin = mongoose.model('Admin', adminSchema)