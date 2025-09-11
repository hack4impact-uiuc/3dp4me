import express, { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/types';
import { runCombinedExport } from '../../../scripts/dataextraction';
import errorWrap from '../../utils/errorWrap';
import path from 'path';
import fs from 'fs';

export const router = express.Router();

router.get(
    '/download',
    errorWrap(async (req: AuthenticatedRequest, res: Response) => {
        // Extract query parameters
        const includeDeleted = req.query.includeDeleted === 'true';
        const includeHidden = req.query.includeHidden === 'true';
        
        const { zipPath } = await runCombinedExport({
            includeDeleted,
            includeHidden,
        });

        // Validate ZIP file exists and has content
        await fs.promises.access(zipPath).catch(() => {
            return res.status(500).send('ZIP file not found');
        });

        const stats = await fs.promises.stat(zipPath);
        if (stats.size === 0) {
            return res.status(500).send('ZIP file is empty');
        }

        // Add a small delay to ensure file is fully written
        await new Promise(resolve => setTimeout(resolve, 100));

        res.download(zipPath, path.basename(zipPath), (err) => {
            if (err) {
                console.error('Error sending ZIP file:', err);
                res.status(500).send('Export failed');
            }
        });
    }),
);

module.exports = router;