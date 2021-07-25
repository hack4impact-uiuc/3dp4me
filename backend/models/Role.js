const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    roleName: {
        EN: { type: String, required: true },
        AR: { type: String, required: true },
    },
    roleDescription: {
        EN: { type: String, required: true, default: '' },
        AR: { type: String, required: true, default: '' },
    },
    isHidden: { type: Boolean, required: false, default: true },
    isMutable: { type: Boolean, required: false, default: true },
});

const Role = mongoose.model('Role', roleSchema, 'Role');

module.exports = {
    Role,
};
