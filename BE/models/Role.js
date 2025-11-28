import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    roleId: { type: String, unique: true, required: true, index: true},
    roleName: { type: String, required: true},
    description: { type: String, }
});

export const Role = mongoose.model('Role', roleSchema);