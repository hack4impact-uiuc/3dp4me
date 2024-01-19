import { NextFunction, Request, Response } from 'express'

/**
 * Wraps a function so that if it throws an error, it is caught and
 * the next middleware is called.
 */
const errorWrap =
    (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next)
    }

export default errorWrap
