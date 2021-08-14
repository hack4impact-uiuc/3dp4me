const _ = require('lodash');

/**
 * Removes attributes from a request's body. So if "_id" is passed in, "_id" will be removed
 * from the request if it exists.
 * @param {Array} attributes String array of attribute keys to remove
 */
module.exports.removeRequestAttributes = (attributes) => {
    return (req, res, next) => {
        req.body = this.removeAttributesFrom(req.body, attributes);
        next();
    };
};

/**
 * Removes a list of attributes from an object
 * @param {Object} obj To remove attributes from
 * @param {Array} attributes String array of attributes to remove
 * @returns
 */
module.exports.removeAttributesFrom = (obj, attributes) => {
    return _.omit(obj, attributes);
};
