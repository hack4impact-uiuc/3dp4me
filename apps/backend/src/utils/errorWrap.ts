/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'

import { AuthenticatedRequest } from '../middleware/types'

type MiddlewareFn =
    | ((req: Request, res: Response, next: NextFunction) => any)
    | ((req: Request, res: Response) => any)
    | ((req: AuthenticatedRequest, res: Response) => any)

/**
 * Wraps a function so that if it throws an error, it is caught and
 * the next middleware is called.
 */
const errorWrap = (fn: MiddlewareFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req as any, res, next)).catch(next)
}

export default errorWrap
