import './Files.scss'

import { File as FileModel } from '@3dp4me/types'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CloseIcon from '@mui/icons-material/Close'
import swal from 'sweetalert'

import { useTranslations } from '../../hooks/useTranslations'
import { formatDate } from '../../utils/date'

export interface FilesProps<T extends string> {
    title: string
    files: FileModel[]
    fieldKey: T
    handleDownload: (key: T, filename: string) => void
    handleDelete: (key: T, file: FileModel) => void
    handleUpload: (key: T, file: File) => void
    isDisabled?: boolean
}

const Files = <T extends string>({
    title,
    files,
    fieldKey,
    handleDownload,
    handleDelete,
    handleUpload,
    isDisabled = false,
}: FilesProps<T>) => {
    const [translations, selectedLang] = useTranslations()

    const onDeleteFile = (file: FileModel) => {
        swal({
            title: translations.components.file.deleteTitle,
            text: translations.components.file.deleteWarning,
            icon: 'warning',
            buttons: [
                translations.components.button.discard.cancelButton,
                translations.components.button.discard.confirmButton,
            ],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                handleDelete(fieldKey, file)
            }
        })
    }

    const getDeleteFileButton = (file: FileModel) => {
        if (isDisabled) return null
        return (
            <button
                className="file-close-button"
                type="button"
                onClick={() => {
                    onDeleteFile(file)
                }}
            >
                <CloseIcon />
            </button>
        )
    }

    const RenderExistingFiles = () => {
        if (files == null) return null

        return files.map((file) => (
            <div className="file-row-wrapper" key={file.filename}>
                <Button
                    className="file-button"
                    onClick={() => {
                        handleDownload(fieldKey, file.filename)
                    }}
                >
                    <div className="file-info-wrapper">
                        <ArrowDownwardIcon />
                        <div className={isDisabled ? `file-info-view` : `file-info-edit`}>
                            <Typography align="left">{`${file.filename}`}</Typography>
                            <p id="file-upload-timestamp">
                                {formatDate(file.uploadDate, selectedLang)}
                            </p>
                        </div>
                    </div>
                </Button>
                {getDeleteFileButton(file)}
            </div>
        ))
    }

    const getAddFileButton = () => {
        if (isDisabled) return null

        return (
            <label htmlFor={`upload-file-input-${title}`}>
                <input
                    id={`upload-file-input-${title}`}
                    className="upload-file-input"
                    type="file"
                    onChange={(e) => {
                        if (e.target.files) handleUpload(fieldKey, e.target.files[0])
                    }}
                />
                <Button className="file-button" component="span">
                    <AddIcon />
                    <Typography align="left">
                        <b>{translations.components.file.addAnother}</b>
                    </Typography>
                </Button>
            </label>
        )
    }

    return (
        <div className="files-wrapper">
            <div className="files-header">
                <h3>{title}</h3>
            </div>
            <div className="files-table">
                {RenderExistingFiles()}
                {getAddFileButton()}
            </div>
        </div>
    )
}

export default Files
