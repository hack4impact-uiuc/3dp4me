import express, { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/types';
import { exportAllPatientsToZip } from '../../utils/dataextraction';
import errorWrap from '../../utils/errorWrap';
import { requireAdmin } from '../../middleware/authentication';
import { queryParamToBool } from '../../utils/request';
import { Language } from '@3dp4me/types';
import { createReadStream, rmdirSync, rmSync } from 'fs';

export const router = express.Router();

router.get(
    '/download',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        const includeDeleted = queryParamToBool(req.query.includeDeleted ?? 'false');
        const includeHidden = queryParamToBool(req.query.includeHidden ?? 'false');
        const language = (req.query.language as Language) || Language.EN
        const zipPath = await exportAllPatientsToZip({
            language,
            includeDeleted,
            includeHidden,
            logger: console,
        });

        // Set appropriate headers
        const filename = `3dp4me_export_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        createReadStream(zipPath).pipe(res).on("close", () => {
            rmSync(zipPath);
        });
    }),
);

export default router;