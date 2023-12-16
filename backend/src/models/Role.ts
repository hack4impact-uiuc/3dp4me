import mongoose from 'mongoose';

import { languageSchema } from '../schemas/languageSchema';

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
    isHidden: { type: Boolean, required: false, default: false },
    isMutable: { type: Boolean, required: false, default: true },
});

export const RoleModel = mongoose.model('Role', roleSchema, 'Role');