import "express-async-errors"
import path from "path"
import { router } from "./src/routes"

import log from "loglevel"
import express from 'express'
import fileUpload from "express-fileupload"
import cors from "cors"
import bodyParser from "body-parser"

import { requireAuthentication } from './src/middleware/authentication';
import { initDB } from './src/utils/initDb';
import {
    setResponseHeaders,
    configureHelment,
} from './src/middleware/responses'
import { logRequest } from './src/middleware/logging';
import { ENV_TEST } from './src/utils/constants';
import { errorHandler } from "./src/utils/errorHandler"
import { StepModel } from "./src/models/Metadata"
import { Signature } from '../../packages/types/dist/src/models/signature';
import { FieldType } from "@3dp4me/types"

const app = express();

app.use(configureHelment());
app.use(setResponseHeaders);
app.use(express.static(path.join(__dirname, './frontend')));
app.use(cors());
app.use(
    fileUpload({
        createParentPath: true,
    }),
);

// const makeSig = async () => {
//     const steps = await StepModel.findOne({ key: 'interview'})
//     console.log(steps)
//     if (steps === null)
//         return

//     steps.fields.push(
//         {
//             fieldNumber: 6,
//             key: 'sig2',
//             fieldType: FieldType.SIGNATURE,
//             options: [],
//             isVisibleOnDashboard: false,
//             displayName: {
//                 EN: "Sig 2",
//                 AR: "Sign 2",
//             },
//             readableGroups: [],
//             writableGroups: [],
//             isHidden: false,
//             isDeleted: false,
//             additionalData: {
//                 defaultDocumentURL: {
//                     EN: "https://d1m40dlonmuszr.cloudfront.net/PatientConsentForm.png",
//                     AR: "https://d1m40dlonmuszr.cloudfront.net/PatientConsentForm.png",
//                 }
//             },
//             subFields: []
//           },
//     )

//     await steps.save()
// }

if (process.env.NODE_ENV !== ENV_TEST) initDB();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// This allows the backend to either serve routes or redirect to frontend
app.get('/*', (req, res, next) => {
    if (req.url.includes('/api')) next();
    else {
        res.sendFile(path.join(__dirname, './frontend/index.html'), (err) => {
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