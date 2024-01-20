import { NextFunction, Request, Response } from 'express'
import _ from 'lodash'

/**
 * Removes attributes from a request's body. So if "_id" is passed in, "_id" will be removed
 * from the request if it exists.
 * @param {Array} attributes String array of attribute keys to remove
 */
export const removeRequestAttributes =
    (attributes: string[]) => (req: Request, res: Response, next: NextFunction) => {
        req.body = removeAttributesFrom(req.body, attributes)
        next()
    }

/**
 * Removes a list of attributes from an object
 * @param {Object} obj To remove attributes from
 * @param {Array} attributes String array of attributes to remove
 * @returns
 */
export const removeAttributesFrom = <T extends object, K extends keyof T>(
    obj: T,
    attributes: K[]
): Omit<T, K> => _.omit(obj, attributes)
