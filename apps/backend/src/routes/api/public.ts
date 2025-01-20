import express, { Response } from 'express';
import mongoose from 'mongoose';

import _ from 'lodash';
import {
    uploadFile,
    downloadFile,
    deleteFile,
    deleteFolder,
} from '../../utils/aws/awsS3Helpers';
import { removeRequestAttributes } from '../../middleware/requests';
import {
    STEP_IMMUTABLE_ATTRIBUTES,
    PATIENT_IMMUTABLE_ATTRIBUTES,
} from '../../utils/constants';
import {
    sendResponse,
    getDataFromModelWithPaginationAndSearch,
} from '../../utils/response';
import { getReadableSteps } from '../../utils/stepUtils';
import { getStepBaseSchemaKeys } from '../../utils/initDb';
import {
    isFieldReadable,
    isFieldWritable,
    getWritableFields,
} from '../../utils/fieldUtils';
import { generateOrderId } from '../../utils/generateOrderId';
import errorWrap from '../../utils/errorWrap';
import { AuthenticatedRequest } from '../../middleware/types';
import { PatientModel } from '../../models/Patient';
import { Patient, Field, File, RootStep } from '@3dp4me/types';
import { StepModel } from '../../models/Metadata';
import { HydratedDocument } from 'mongoose';
import { fromBuffer } from 'pdf2pic';

export const router = express.Router();
/**
 * Returns everything in the patients collection (basic patient info)
 */
router.post(
    '/upload/signatureDocument',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        // TODO: Get file 
    }),
);

const pdfToPng = async (buffer: Buffer): Promise<Buffer> => {
    const pngPages = await fromBuffer(buffer, { format: "png" })()
    // TODO: Use sharp from https://github.dev/ccpu/join-images
}


module.exports = router;
