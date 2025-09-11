import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from '@mui/material'
import { triggerExportDownload } from '../../api/api'

interface ExportButtonProps {
  buttonText?: string
  onExportComplete?: () => void
  onExportError?: (error: Error) => void
}

const ExportButton: React.FC<ExportButtonProps> = ({
  buttonText = 'Export Data',
  onExportComplete,
  onExportError
}) => {
  const [open, setOpen] = useState(false)
  const [includeDeleted, setIncludeDeleted] = useState(false)
  const [includeHidden, setIncludeHidden] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      await triggerExportDownload(includeDeleted, includeHidden)
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
        {buttonText}
      </Button>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        aria-labelledby="export-dialog-title"
      >
        <DialogTitle id="export-dialog-title">Export Options</DialogTitle>
        <DialogContent>
          <FormControlLabel
            control={
              <Checkbox 
                checked={includeDeleted} 
                onChange={e => setIncludeDeleted(e.target.checked)}
                disabled={loading}
              />
            }
            label="Include Deleted Steps"
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={includeHidden} 
                onChange={e => setIncludeHidden(e.target.checked)}
                disabled={loading}
              />
            }
            label="Include Hidden Fields"
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
            {loading ? 'Exporting...' : 'Export as ZIP'}
          </Button>
          <Button 
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExportButton
