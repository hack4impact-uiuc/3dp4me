import { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

// Describes the same origin
const SRC_SELF = ["'self'", 'blob:', 'data:']

// Describes cognito origins
const SRC_COGNITO = [
    'https://cognito-idp.eu-north-1.amazonaws.com/',
    'https://3dp4me-users.auth.eu-north-1.amazoncognito.com/oauth2/token',
    'https://3dp4me-prosthetic-users.auth.eu-north-1.amazoncognito.com/oauth2/token',
    'https://eu-north-1pbpdjvkrs.auth.eu-north-1.amazoncognito.com/oauth2/token',
    'https://cognito-identity.eu-north-1.amazonaws.com/',
]

// Describes S3 origins
const SRC_S3 = [
    'https://3dp4me-public.s3.eu-north-1.amazonaws.com/',
    'https://3dp4me-patient-data.s3.eu-north-1.amazonaws.com/',
    'https://3dp4me-prosthetics-patient-data.s3.eu-north-1.amazonaws.com/',
    'https://d1m40dlonmuszr.cloudfront.net/',
]

const SRC_GOOGLE_MAPS = [
    'https://*.googleapis.com',
    'https://*.gstatic.com',
    '*.google.com',
    'https://*.ggpht.com',
    '*.googleusercontent.com',
]

/**
 * Middleware to set response headers. These are just for some extra security precautions.
 */
export const setResponseHeaders = (req: Request, res: Response, next: NextFunction) => {
    // res.append('Cross-Origin-Embedder-Policy', 'require-corp')
    res.append('Cross-Origin-Opener-Policy', 'same-origin')
    // res.append('Cross-Origin-Resource-Policy', 'cross-origin')
    res.append('Strict-Transport-Security', 'max-age=31536000; preload')
    next()
}

/**
 * Creates the middleware object for Helmet. Used for security.
 * @returns The Helment middleware.
 */
export const configureHelment = () =>
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                'connect-src': [...SRC_SELF, ...SRC_COGNITO, ...SRC_GOOGLE_MAPS],
                'img-src': [...SRC_SELF, ...SRC_S3, ...SRC_GOOGLE_MAPS],
                'frame-src': [...SRC_SELF, '*.google.com'],
                'font-src': [...SRC_SELF, 'https://fonts.gstatic.com'],
                'media-src': [...SRC_SELF, ...SRC_S3],
                'object-src': [...SRC_SELF],
                'worker-src': [...SRC_SELF],
                'child-src': [...SRC_SELF],
                'script-src': [...SRC_SELF, ...SRC_GOOGLE_MAPS],
            },
        },
    })
