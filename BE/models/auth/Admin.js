import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    roleId: {type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true},
    adminName: {type: String, required: true},
    passWord: {type: String, required: true},
    address: {type: String},
    email: {type: String},
    DoB: {type: Date},
    phoneNum: {type: String},
    sex: {type: Boolean}
}, {timestamps: true});

export const Admin = mongoose.model('Admin', adminSchema)