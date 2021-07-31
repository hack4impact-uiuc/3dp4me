/**
 * Logs some information about the incoming request. We need this
 * for HIPPA compliance. This middleware should be placed after auth
 * but before serving the route.
 */
module.exports.logRequest = (req, res, next) => {
    console.log(
        '-------------------------- REQUEST --------------------------',
    );
    console.log(`${Date.now()}: ${req.method} ${req.url}`);
    console.log('------------ USER ------------');
    console.log(req.user);
    console.log('----------- HEADER -----------');
    console.log(req.headers);
    console.log('------------ BODY ------------');
    console.log(req.body);

    next();
};
