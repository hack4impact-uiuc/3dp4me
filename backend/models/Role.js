const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: { type: String, required: true, unique: true },
    roleDescription: { type: String, required: false, default: '' },
    isMutable: { type: Boolean, required: false, default: true },
});

const Role = mongoose.model('Role', roleSchema, 'Role');

module.exports = {
    Role,
};
