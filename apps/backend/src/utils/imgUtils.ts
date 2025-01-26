import { Nullish } from '@3dp4me/types'
import joinImages from 'join-images'
import { fromBuffer } from 'pdf2pic'

export const pdfToPng = async (buffer: Buffer): Promise<Nullish<Buffer>> => {
    const converter = await fromBuffer(buffer, { format: 'png', quality: 100 })
    const pngPages = await converter.bulk(-1, { responseType: 'buffer' })
    if (pngPages.length < 1) {
        return null
    }

    const pngBuffers = pngPages
        .map((page) => page.buffer)
        .filter(<T>(b: T | undefined): b is T => !!b)
    const img = await joinImages(pngBuffers, { direction: 'vertical' })
    return img.toFormat('png').toBuffer()
}
