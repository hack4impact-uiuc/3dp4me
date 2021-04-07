const express = require('express');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models/index');

// TODO: This should be moved into /users
// In AWS, we store the roles by a list of mongo IDs. AWS Puts a hard limit on the length
// of the security roles attribute, so we must make sure we don't give a user too many roles.
// The length of one role entry is the length of the monogoID (24) and a comma (1)
const ROLE_ENTRY_LENGTH = 24 + 1;

// Get all roles
router.get(
    '/',
    errorWrap(async (req, res) => {
        const roles = await models.Role.find({});

        return res.status(200).json({
            success: true,
            result: roles,
        });
    }),
);

// Adds role to the DB
router.post(
    '/',
    errorWrap(async (req, res) => {
        const newRole = new models.Role(req.body);
        const savedRole = await newRole.save();

        return res.status(200).json({
            success: true,
            result: savedRole,
        });
    }),
);

// Changes role
router.put(
    '/:roleId',
    errorWrap(async (req, res) => {
        const { roleId } = req.params;
        const role = await models.Role.findById(roleId);
        if (role == null) {
            return res.status(400).json({
                success: false,
                message: `Role with ID "${roleId}" does not exist`,
            });
        }

        if (!role.isMutable) {
            return res.status(400).json({
                success: false,
                message: `Role with ID "${roleId}" cannot be modified`,
            });
        }

        delete req.body._id;
        const result = await models.Role.findByIdAndUpdate(
            roleId,
            { $set: req.body },
            { new: true },
        );

        return res.status(200).json({
            success: true,
            result: result,
        });
    }),
);

// Delete role
router.delete(
    '/:roleId',
    errorWrap(async (req, res) => {
        const { roleId } = req.params;
        const role = await models.Role.findById(roleId);
        if (role == null) {
            return res.status(400).json({
                success: false,
                message: `Role with ID "${roleId}" does not exist`,
            });
        }

        if (!role.isMutable) {
            return res.status(400).json({
                success: false,
                message: `Role with ID "${roleId}" is not allowed to be deleted`,
            });
        }

        await models.Role.findByIdAndDelete(roleId);
        return res.status(200).json({
            success: true,
            message: 'Role deleted',
        });
        // TODO: When role is added/removed from user, cleanse user
    }),
);

module.exports = router;
