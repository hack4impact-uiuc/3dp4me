const helmet = require('helmet');

module.exports.setResponseHeaders = (req, res, next) => {
    res.append('Cross-Origin-Embedder-Policy', 'require-corp');
    res.append('Cross-Origin-Opener-Policy', 'same-origin');
    res.append('Strict-Transport-Security', 'max-age=31536000; preload');
    next();
};

module.exports.configureHelment = () => {
    const SRC_SELF = ["'self'", 'blob:'];
    const SRC_COGNITO = [
        'https://cognito-idp.eu-north-1.amazonaws.com/',
        'https://3dp4me.auth.eu-north-1.amazoncognito.com/oauth2/token',
        'https://cognito-identity.eu-north-1.amazonaws.com/',
    ];
    const SRC_S3 = [
        'https://3dp4me-public.s3.eu-north-1.amazonaws.com/',
        'https://3dp4me-patient-data.s3.eu-north-1.amazonaws.com/',
        'https://d1m40dlonmuszr.cloudfront.net/',
    ];

    return helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'connect-src': [...SRC_SELF, ...SRC_COGNITO],
                'img-src': [...SRC_SELF, ...SRC_S3],
                'media-src': [...SRC_SELF, ...SRC_S3],
                'object-src': [...SRC_SELF],
            },
        },
    });
};
