module.exports.setResponseHeaders = (req, res, next) => {
    res.append('Cross-Origin-Embedder-Policy', 'require-corp');
    res.append('Cross-Origin-Opener-Policy', 'same-origin');
    next();
};
