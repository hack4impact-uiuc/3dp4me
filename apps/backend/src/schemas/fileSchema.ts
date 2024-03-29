import { File } from '@3dp4me/types'
import mongoose from 'mongoose'

/**
 * Schema for storing files. The file contents are stored in S3, this records
 * the location of the file in the S3.
 */
export const fileSchema = new mongoose.Schema<File>({
    filename: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    uploadDate: { type: Date, required: true },
})
