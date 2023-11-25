const express = require('express');

const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models/index');
const { requireAdmin } = require('../../middleware/authentication');
const { sendResponse } = require('../../utils/response');

/**
 * Returns all roles in the DB.
 */
router.get(
    '/',
    errorWrap(async (req, res) => {
        const roles = await models.Role.find({});
        return sendResponse(res, 200, '', roles);
    }),
);

/**
 * Adds role to DB.
 */
router.post(
    '/',
    requireAdmin,
    errorWrap(async (req, res) => {
        const newRole = new models.Role(req.body);
        const savedRole = await newRole.save();
        return sendResponse(res, 200, 'Role created', savedRole);
    }),
);

/**
 * Updates a role. This should only update either the role name or description.
 * If the role to update is marked as immutable, it is not modified.
 */
router.put(
    '/:roleId',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { roleId } = req.params;
        const role = await models.Role.findById(roleId);
        if (!role) return sendResponse(res, 404, `Role ${roleId} not found`);

        if (!role.isMutable) return sendResponse(res, 403, 'Role is immutable');

        const result = await models.Role.findByIdAndUpdate(
            roleId,
            { $set: req.body },
            { new: true },
        );

        return sendResponse(res, 200, 'Role updated', result);
    }),
);

/**
 * Deletes a role. Immutable roles cannot be deleted.
 */
router.delete(
    '/:roleId',
    requireAdmin,
    errorWrap(async (req, res) => {
        const { roleId } = req.params;
        const role = await models.Role.findById(roleId);
        if (!role) return sendResponse(res, 404, `Role ${roleId} not found`);

        if (!role.isMutable) return sendResponse(res, 403, 'Role is immutable');

        await models.Role.findByIdAndDelete(roleId);
        return sendResponse(res, 200, 'Role deleted');
    }),
);

module.exports = router;
