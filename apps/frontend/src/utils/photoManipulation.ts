import { File as FileModel } from '@3dp4me/types'

import { downloadBlobWithoutSaving } from '../api/api'

export const blobToDataURL = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(reader.error)
        reader.onabort = () => reject(new Error('Read aborted'))
        reader.readAsDataURL(blob)
    })

interface PhotoWithUri extends FileModel {
    uri: string
}

export const convertPhotosToURI = async (
    photoData: FileModel[],
    stepKey: string,
    fieldKey: string,
    patientId: string
): Promise<PhotoWithUri[]> => {
    const newPhotoData = photoData.map(async (photoObj) => {
        const uri = await photoToURI(photoObj, stepKey, fieldKey, patientId)

        return {
            ...photoObj,
            uri,
        }
    })

    return Promise.all(newPhotoData)
}

export const photoToURI = async (
    photoObj: FileModel,
    stepKey: string,
    fieldKey: string,
    patientId: string
) => {
    const blob = await downloadBlobWithoutSaving(patientId, stepKey, fieldKey, photoObj.filename)

    if (!blob) {
        console.warn(`Blob was null for ${photoObj}-${stepKey}-${fieldKey}-${patientId}`)
        return ''
    }

    const uri = await blobToDataURL(blob)
    return uri
}

export const dataURItoBlob = (dataURI: string) => {
    let byteString = ''
    let mimeString = ''
    if (dataURI) {
        const splitByComma = dataURI.split(',')
        if (splitByComma.length >= 2) {
            const one = splitByComma[1]
            byteString = atob(one)
            if (byteString) {
                const comma = dataURI.split(',')[0]
                const splitByColon = comma.split(':')
                if (splitByColon.length >= 2) {
                    const colonOne = splitByColon[1]
                    const semicolon = colonOne.split(';')[0]
                    mimeString = semicolon
                }
            }
        }
    }
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ab], { type: mimeString })
}
