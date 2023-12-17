import log from 'loglevel';

import { getUserByAccessToken } from '../utils/aws/awsUsers';
import {
    AccessLevel,
    ERR_AUTH_FAILED,
    ERR_NOT_APPROVED,
    ADMIN_ID,
} from '../utils/constants';
import { sendResponse } from '../utils/response';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from './types';

/**
 * Middleware requires the incoming request to be authenticated. If not authenticated, a response
 * is sent back to the client, and the middleware chain is stopped. Authenticatio is done through
 * the 'authentication' HTTP header, which should be of the format 'Bearer <ACCESS_TOKEN>'. If
 * successful, the user's data is attachted to req.user before calling the next function.
 */
export const requireAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            sendResponse(res, 401, ERR_AUTH_FAILED);
        } else if (user.accessLevel !== AccessLevel.GRANTED) {
            sendResponse(res, 403, ERR_NOT_APPROVED);
        } else {
            (req as AuthenticatedRequest).user = user;
            next();
        }
    } catch (error) {
        log.error(error);
        sendResponse(res, 401, ERR_AUTH_FAILED);
    }
};

/**
 * Constructs a middleware function that requires the user to
 * have the specified role ID.
 * @param {String} role The mongo ID of the role required.
 * @returns A middleware function that requires the role.
 */
export const requireRole = (role: string) => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // If there isn't a user, authenticate
    if (!req.user) {
        return requireAuthentication(req, res, () => {
            requireRole(role)
            next()
        })
    }
    if (!req.user.roles.includes(role))
        sendResponse(res, 403, ERR_NOT_APPROVED);
    else next();
};

/**
 * Convienience middleware to require a user to be Admin before proceeding.
 */
export const requireAdmin = requireRole(ADMIN_ID);

const getUserFromRequest = async (req: Request) => {
    const authHeader = req?.headers?.authorization?.split(' ');
    if (authHeader?.length !== 2) return null;

    const accessToken = authHeader[1];
    return getUserByAccessToken(accessToken);
};
