import express, {Response} from 'express';
import { requireAdmin } from '../../middleware/authentication';
import { sendResponse } from '../../utils/response';
import errorWrap from '../../utils/errorWrap';
import { AuthenticatedRequest } from '../../middleware/types';
import { RoleModel } from '../../models/Role';

export const router = express.Router();
/**
 * Returns all roles in the DB.
 */
router.get(
    '/',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const roles = await RoleModel.find({});
        return sendResponse(res, 200, '', roles);
    }),
);

/**
 * Adds role to DB.
 */
router.post(
    '/',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const newRole = new RoleModel(req.body);
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
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { roleId } = req.params;
        const role = await RoleModel.findById(roleId);
        if (!role) return sendResponse(res, 404, `Role ${roleId} not found`);

        if (!role.isMutable) return sendResponse(res, 403, 'Role is immutable');

        const result = await RoleModel.findByIdAndUpdate(
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
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const { roleId } = req.params;
        const role = await RoleModel.findById(roleId);
        if (!role) return sendResponse(res, 404, `Role ${roleId} not found`);

        if (!role.isMutable) return sendResponse(res, 403, 'Role is immutable');

        await RoleModel.findByIdAndDelete(roleId);
        return sendResponse(res, 200, 'Role deleted');
    }),
);

module.exports = router;
