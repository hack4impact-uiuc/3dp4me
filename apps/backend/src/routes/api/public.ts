import express, { Response } from 'express';
import _ from 'lodash';
import {
    sendResponse,
} from '../../utils/response';
import errorWrap from '../../utils/errorWrap';
import { AuthenticatedRequest } from '../../middleware/types';
import fileUpload from 'express-fileupload';
import { pdfToPng } from '../../utils/imgUtils';
import { Nullish } from '@3dp4me/types';
import { uploadPublicFile } from '../../utils/aws/awsS3Helpers';

export const router = express.Router();

/**
 * Converts a pdf to a png and uploads it to the public bucket
 */
router.post(
    '/upload/signatureDocument',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const filename = req.body.uploadedFileName
        if (!filename)
            return sendResponse(res, 400, "uploadedFileName is required")

        const file = fileFromRequest(req)
        if (!file) {
            return sendResponse(res, 400, "exactly one file must be present in request")
        }

        const png = await pdfToPng(file.data)
        if (!png) {
            return sendResponse(res, 500, "could not convert pdf to png")
        }

        await uploadPublicFile(png, filename)
        return sendResponse(res, 200, "uploaded file") 
    }),
);

const fileFromRequest = (req: AuthenticatedRequest): Nullish<fileUpload.UploadedFile> => {
    const files = req.files?.uploadedFile
    if (!files) {
        return null
    }

    if (!Array.isArray(files)) {
        return files
    }

    if (files.length > 0) {
        return files[0]
    }

    return null
}


module.exports = router;
