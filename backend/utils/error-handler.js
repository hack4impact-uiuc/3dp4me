const errorHandler = (err, req, res, _next) => {
    console.error(err);
    res.status(500).json({
        code: 500,
        message: err.message,
        result: {},
        success: false,
    });
};

module.exports = errorHandler;
