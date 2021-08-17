const mongoose = require('mongoose');
const { languageSchema } = require('../schemas/languageSchema');

/**
 * Contains information about user roles. the name and description are just for
 * readability. We use _id to link roles to users in the DB. isHidden indicates if the
 * role should be visible on the dashboard. isMutable indicates if the role can be changed.
 */
const roleSchema = new mongoose.Schema({
    roleName: {
        type: languageSchema,
        required: true,
    },
    roleDescription: {
        type: languageSchema,
        required: false,
    },
    isHidden: { type: Boolean, required: false, default: true },
    isMutable: { type: Boolean, required: false, default: true },
});

const Role = mongoose.model('Role', roleSchema, 'Role');

module.exports = {
    Role,
};
