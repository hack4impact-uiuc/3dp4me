import express, { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/types';
import { runCombinedExport } from '../../../scripts/dataextraction';
import errorWrap from '../../utils/errorWrap';
import { requireAdmin } from '../../middleware/authentication';
import { queryParamToBool } from '../../utils/request';

export const router = express.Router();

router.get(
    '/download',
    requireAdmin as any,
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        // Extract query parameters
        const includeDeleted = queryParamToBool(req.query.includeDeleted ?? 'false');
        const includeHidden = queryParamToBool(req.query.includeHidden ?? 'false');
        
        // Get the zip stream directly
        const zipStream = await runCombinedExport({
            includeDeleted,
            includeHidden,
        });

        // Set appropriate headers
        const filename = `3dp4me_export_${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        // Pipe the stream directly to the response
        zipStream.pipe(res);
    }),
);

export default router;