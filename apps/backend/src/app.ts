import "express-async-errors"
import path from "path"
import { router } from "./routes"

import log from "loglevel"
import express, { NextFunction } from 'express'
import fileUpload from "express-fileupload"
import cors from "cors"
import bodyParser from "body-parser"

import { requireAuthentication } from './middleware/authentication';
import { initDB } from './utils/initDb';
import {
    setResponseHeaders,
    configureHelment,
} from './middleware/responses'
import { logRequest } from './middleware/logging';
import { ENV_TEST } from './utils/constants';
import { errorHandler } from "./utils/errorHandler"
import { Request, Response } from 'express';

const app = express();


if (process.env.NODE_ENV === 'development') {
    log.setLevel(log.levels.DEBUG)
} else {
    log.setLevel(log.levels.TRACE)
}

app.use(configureHelment());
app.use(setResponseHeaders);
app.use(express.static(path.join(__dirname, './frontend')));
app.use(cors());
app.use(
    fileUpload({
        createParentPath: true,
    }),
);

if (process.env.NODE_ENV !== ENV_TEST) initDB();
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// This allows the backend to either serve routes or redirect to frontend
app.get('/*', (req: Request, res: Response, next: NextFunction) => {
    if (req.url.includes('/api')) next();
    else {
        res.sendFile(path.join(__dirname, './frontend/index.html'), (err: any) => {
            if (err) res.status(500).send(err);
        });
    }
});

app.use(requireAuthentication);
app.use(logRequest as any);
app.use(router);

app.use(errorHandler);

process.on('unhandledRejection', (reason) => {
    log.error(`UNHANDLED REJECTION: ${reason}`);
});

export default app