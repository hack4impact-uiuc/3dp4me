import { NextFunction, Response } from 'express'
import log from 'loglevel'

import { AuthenticatedRequest } from './types'

/**
 * Logs some information about the incoming request. We need this
 * for HIPPA compliance. This middleware should be placed after auth
 * but before serving the route.
 */
export const logRequest = (req: AuthenticatedRequest, _: Response, next: NextFunction) => {
    log.debug(JSON.stringify({
        time: Date.now(),
        method: req.method,
        url: req.url,
        user: req.user,
        headers: req.headers,
        body: req.body,
    }, null, 2))

    next()
}
