import Button from '@material-ui/core/Button'
import Modal from '@material-ui/core/Modal'
import { FC, useRef } from 'react'
import ReactSignatureCanvas from 'react-signature-canvas'
import SignaturePad from 'signature_pad'

import { useTranslations } from '../../hooks/useTranslations'

interface NewSignatureModalProps {
    isOpen: boolean
    onSave: (data: SignatureData) => void
    onClose: () => void
}

export interface SignatureData {
    points: SignaturePad.Point[][]
    width: number
    height: number
}

export const NewSiganatureModal: FC<NewSignatureModalProps> = ({ isOpen, onSave, onClose }) => {
    const translations = useTranslations()[0]
    const canvasRef = useRef<ReactSignatureCanvas | null>(null)

    /**
     * Saves signature data points along with the canvas width and height so that
     * we can display it across different device sizes. Also save the document URL
     * that was shown at the time of signing (in case it's updated in the future)
     */
    const save = () => {
        const canvas = canvasRef.current?.getCanvas()
        if (!canvas || !canvasRef.current) {
            console.error(`Could not save signature data. Canvas was null`)
            return
        }

        onSave({
            points: canvasRef.current.toData(),
            width: canvas.width,
            height: canvas.height,
        })
    }

    const clear = () => {
        canvasRef.current?.clear()
    }

    return (
        <Modal open={isOpen} className="signature-modal">
            <div>
                <ReactSignatureCanvas
                    ref={canvasRef}
                    canvasProps={{
                        className: 'signature-canvas',
                    }}
                />
                {/* Button to trigger save canvas image */}
                <Button className="signature-button save-signature" onClick={save}>
                    {translations.components.signature.save}
                </Button>
                <Button className="signature-button clear-signature" onClick={clear}>
                    {translations.components.signature.clear}
                </Button>
                <Button className="signature-button close-signature" onClick={onClose}>
                    {translations.components.signature.close}
                </Button>
            </div>
        </Modal>
    )
}
