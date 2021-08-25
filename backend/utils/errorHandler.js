/**
 * Global error handler. As a last resort, if any route throws an error, this
 * should catch it and return a 500.
 */
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (res?.headersSent) {
        next(err);
    } else {
        res.status(500).json({
            success: false,
            message: `An error occurred: ${err?.message}`,
        });
    }
};

module.exports = errorHandler;
