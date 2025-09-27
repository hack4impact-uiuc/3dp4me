import {
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
} from '@mui/material'
import React, { useState } from 'react'

import { downloadAllPatientData } from '../../api/api'
import { useTranslations } from '../../hooks/useTranslations'

interface ExportButtonProps {
    onExportComplete?: () => void
    onExportError?: (error: Error) => void
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExportComplete, onExportError }) => {
    const translations = useTranslations()[0]
    const [open, setOpen] = useState(false)
    const [includeDeleted, setIncludeDeleted] = useState(false)
    const [includeHidden, setIncludeHidden] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            await downloadAllPatientData(includeDeleted, includeHidden)
            setOpen(false)
            onExportComplete?.()
        } catch (error) {
            console.error('Export failed:', error)
            onExportError?.(error as Error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="contained"
                color="primary"
                aria-label="Open export options"
            >
                {translations.exportPatientData}
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="export-dialog-title"
            >
                <DialogTitle id="export-dialog-title">
                    {translations.exportOptionsTitle}
                </DialogTitle>
                <DialogContent>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeDeleted}
                                onChange={(e) => setIncludeDeleted(e.target.checked)}
                                disabled={loading}
                            />
                        }
                        label={translations.exportIncludeDeleted}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={includeHidden}
                                onChange={(e) => setIncludeHidden(e.target.checked)}
                                disabled={loading}
                            />
                        }
                        label={translations.exportIncludeHidden}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDownload}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {translations.exportAsZip}
                    </Button>
                    <Button onClick={() => setOpen(false)} disabled={loading}>
                        {translations.cancel}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ExportButton
