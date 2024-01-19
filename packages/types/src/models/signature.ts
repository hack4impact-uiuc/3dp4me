import { TranslatedString } from './translatedString'

export interface SignaturePoint {
    x: number
    y: number
    time: number
    color?: string
}

export interface Signature {
    signatureData: SignaturePoint[][]
    signatureCanvasWidth: number
    signatureCanvasHeight: number

    // TODO: This is duplicated in value?
    documentURL: TranslatedString
}
