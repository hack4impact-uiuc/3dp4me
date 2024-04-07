import { ChangeEventHandler, ReactNode, useRef } from 'react'

import { StyledButton, StyledButtonProps } from '../StyledButton/StyledButton'

export interface FileUploadButtonProps {
    onSelectFile: (file: File) => void
    fileTypes?: string
    children?: ReactNode
    style?: StyledButtonProps
}

export const FileUploadButton = ({
    onSelectFile,
    fileTypes,
    children,
    style,
}: FileUploadButtonProps) => {
    // Create a reference to the hidden file input element
    const hiddenFileInput = useRef<HTMLInputElement>(null)

    const handleClick = () => {
        hiddenFileInput.current?.click()
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        if (!event.target.files) return

        const fileUploaded = event.target.files[0]
        onSelectFile(fileUploaded)
    }

    return (
        <>
            <StyledButton onClick={handleClick} {...style} primary>
                {children}
            </StyledButton>
            <input
                type="file"
                accept={fileTypes}
                onChange={handleChange}
                ref={hiddenFileInput}
                style={{ display: 'none' }} // Make the file input element invisible
            />
        </>
    )
}
