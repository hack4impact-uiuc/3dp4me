/* eslint-disable no-use-before-define */

import './SignatureField.scss'

import { Nullish, Path, PathValue, Signature, TranslatedString } from '@3dp4me/types'
import Button from '@material-ui/core/Button'
import hash from 'object-hash'
import { useState } from 'react'

import { useTranslations } from '../../hooks/useTranslations'
import { ControlledSignatureCanvas } from '../ControlledSignatureCanvas/ControlledSignatureCanvas'
import { NewSiganatureModal, SignatureData } from '../NewSignatureModal/NewSignatureModal'

export interface SignatureFieldProps<T extends string> {
    displayName: string
    isDisabled: boolean
    documentURL: TranslatedString
    fieldId: T
    value?: Nullish<Signature>
    onChange?: (key: `${T}.${Path<Signature>}`, value: PathValue<Signature>) => void
}

const SignatureField = <T extends string>({
    displayName,
    isDisabled,
    documentURL,
    fieldId,
    value = null,
    onChange = () => {},
}: SignatureFieldProps<T>) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDocumentVisible, setIsDocumentVisible] = useState(false)
    const translations = useTranslations()[0]

    /**
     * Saves signature data points along with the canvas width and height so that
     * we can display it across different device sizes. Also save the document URL
     * that was shown at the time of signing (in case it's updated in the future)
     */
    const onNewSignature = (data: SignatureData) => {
        onChange(`${fieldId}.signatureData`, data.points)
        onChange(`${fieldId}.signatureCanvasWidth`, data.width)
        onChange(`${fieldId}.signatureCanvasHeight`, data.height)
        onChange(`${fieldId}.documentURL.EN`, documentURL.EN)
        onChange(`${fieldId}.documentURL.AR`, documentURL.AR)
        setIsModalOpen(false)
    }

    /**
     * Toggles whether the signing docs are visible
     */
    const onToggleDocument = () => {
        setIsDocumentVisible((visible) => !visible)
    }

    /**
     * Shows the documents that the user is signing
     */
    const renderDocuments = () => {
        if (!isDocumentVisible) return null

        return (
            <div>
                {/* For now we are only showing the arabic document */}
                {/* <img
                    alt="document"
                    className="sig-document"
                    src={value?.documentURL?.EN || documentURL?.EN}
                /> */}
                <img
                    alt="document"
                    className="sig-document"
                    src={value?.documentURL?.AR || documentURL?.AR}
                />
            </div>
        )
    }

    return (
        <div className="signature-container">
            <h3>{displayName}</h3>
            {renderDocuments()}
            <NewSiganatureModal
                onClose={() => setIsModalOpen(false)}
                onSave={onNewSignature}
                isOpen={isModalOpen}
            />
            <div className="sig-container">
                {/* We need to keep changing the key to force a rerender */}
                <ControlledSignatureCanvas key={hashSignature(value)} value={value} />
                <div className="sig-ctl-container">
                    <Button
                        className="sig-ctl-button doc-btn"
                        disabled={isDisabled}
                        onClick={onToggleDocument}
                    >
                        {isDocumentVisible
                            ? translations.components.signature.hideDoc
                            : translations.components.signature.viewDoc}
                    </Button>
                    <Button
                        className="sig-ctl-button sign-btn"
                        disabled={isDisabled}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {translations.components.signature.sign}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const hashSignature = (sig: Nullish<Signature>): string => {
    if (!sig)
        return hash(Math.random())

    return hash(JSON.stringify(sig))
}

export default SignatureField
