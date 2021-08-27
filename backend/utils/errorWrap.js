/**
 * Wraps a function so that if it throws an error, it is caught and
 * the next middleware is called.
 */
const errorWrap = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = errorWrap;
