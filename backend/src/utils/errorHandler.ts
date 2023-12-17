import { NextFunction, Request, Response } from "express";
import log from "loglevel"

/**
 * Global error handler. As a last resort, if any route throws an error, this
 * should catch it and return a 500.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    log.error(err);
    if (res?.headersSent) {
        next(err);
    } else {
        res.status(500).json({
            success: false,
            message: `An error occurred: ${err?.message}`,
        });
    }
};