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
    isOpen: boolean
    onClose: () => void
    onExportComplete?: () => void
    onExportError?: (error: Error) => void
}

const ExportModal: React.FC<ExportButtonProps> = ({ onExportComplete, onExportError, isOpen, onClose }) => {
    const translations = useTranslations()[0]
    const [includeDeleted, setIncludeDeleted] = useState(false)
    const [includeHidden, setIncludeHidden] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDownload = async () => {
        setLoading(true)
        try {
            await downloadAllPatientData(includeDeleted, includeHidden)
            onExportComplete?.()
        } catch (error) {
            console.error('Export failed:', error)
            onExportError?.(error as Error)
        } finally {
            setLoading(false)
            onClose()
        }
    }

    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onClose}
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
                    <Button onClick={onClose} disabled={loading}>
                        {translations.cancel}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ExportModal
