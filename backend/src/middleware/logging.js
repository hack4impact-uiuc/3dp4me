const log = require('loglevel');

/**
 * Logs some information about the incoming request. We need this
 * for HIPPA compliance. This middleware should be placed after auth
 * but before serving the route.
 */
module.exports.logRequest = (req, res, next) => {
    log.trace('-------------------------- REQUEST --------------------------');
    log.trace(`${Date.now()}: ${req.method} ${req.url}`);
    log.trace('------------ USER ------------');
    log.trace(req.user);
    log.trace('----------- HEADER -----------');
    log.trace(req.headers);
    log.trace('------------ BODY ------------');
    log.trace(req.body);

    next();
};
