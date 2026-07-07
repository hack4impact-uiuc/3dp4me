/**
 * One-time migration: decrypt all mongoose-encryption data and re-write it plaintext.
 *
 * HOW IT WORKS
 *   1. Connect to MongoDB and register all dynamic step models (with the encryption plugin
 *      still in place, so mongoose can decrypt on read).
 *   2. For each collection, fetch every document through Mongoose — this triggers the
 *      mongoose-encryption `init` hook that decrypts `_ct` back into real fields.
 *   3. Write the plain JS object back via the native MongoDB driver, which bypasses
 *      the `pre-save` hook and therefore does NOT re-encrypt.
 *   4. The encrypted blob fields `_ct` and `_ac` are stripped before writing.
 *
 * PREREQUISITES
 *   DB_URI, ENCRYPTION_KEY, and SIGNING_KEY must be in the environment.
 *
 * BUILD (compile this script + src to dist-scripts/)
 *   npx tsc --project tsconfig.scripts.json
 *
 * RUN (dry run — connects, reports target DB + per-collection counts, writes NOTHING)
 *   doppler run -- node dist-scripts/scripts/decrypt_db.js --dry-run
 *
 * RUN (for real — permanently rewrites data)
 *   doppler run -- node dist-scripts/scripts/decrypt_db.js
 *
 * WARNING: A real run permanently modifies the database. Confirm you have a recent
 * Atlas backup before running and know how to restore from a snapshot.
 */

import mongoose from 'mongoose'
import log from 'loglevel'

import { PatientModel } from '../src/models/Patient'
import { StepModel } from '../src/models/Metadata'
import { initModels } from '../src/utils/initDb'

const isDryRun = process.argv.includes('--dry-run')

const decryptCollection = async (
    collectionName: string,
    Model: mongoose.Model<any>,
): Promise<void> => {
    // Do NOT use .lean() — it bypasses mongoose-encryption's init middleware and
    // the data would remain encrypted in the returned objects.
    const docs = await Model.find({})

    if (isDryRun) {
        log.info(`  ${collectionName.padEnd(30)} ${docs.length} document(s)`)
        return
    }

    log.info(`  Decrypting "${collectionName}"...`)

    if (docs.length === 0) {
        log.info(`    No documents found, skipping.`)
        return
    }

    // Use the raw MongoDB driver so we don't go through the Mongoose pre-save hook
    // (which would re-encrypt the data).
    const nativeCollection = mongoose.connection.db!.collection(collectionName)

    for (const doc of docs) {
        // toObject() returns the in-memory document state, which has already been
        // decrypted by the init hook. versionKey: false omits __v.
        const plain = doc.toObject({ versionKey: false }) as Record<string, unknown>

        // Belt-and-suspenders: remove encryption artifacts. These should already be
        // absent after decryption, but strip them explicitly just in case.
        delete plain._ct
        delete plain._ac

        await nativeCollection.replaceOne({ _id: plain._id }, plain)
    }

    log.info(`    Done — ${docs.length} document(s) decrypted.`)
}

const main = async (): Promise<void> => {
    log.setLevel('info')

    const missing = ['DB_URI', 'ENCRYPTION_KEY', 'SIGNING_KEY'].filter((k) => !process.env[k])
    if (missing.length > 0) {
        log.error(`Missing required environment variables: ${missing.join(', ')}`)
        log.error(
            'Run with: doppler run -- npx ts-node --project tsconfig.scripts.json scripts/decrypt_db.ts',
        )
        process.exit(1)
    }

    log.info('Connecting to database...')
    await mongoose.connect(process.env.DB_URI!)
    const { db } = mongoose.connection
    log.info('Connected.\n')

    // Print the target so you can confirm you're pointed at the right cluster/DB
    // before anything is modified.
    log.info(`  Host:     ${mongoose.connection.host}`)
    log.info(`  Database: ${db!.databaseName}`)
    log.info('')

    // Register all dynamic step models so mongoose knows about each collection.
    // generateSchemaFromMetadata (called inside initModels) attaches mongoose-encryption,
    // which is what lets us decrypt on read.
    await initModels()

    if (isDryRun) {
        log.info('DRY RUN — no data will be modified.\n')
        log.info('Collections that would be processed:')
    } else {
        log.info('Starting decryption migration...\n')
    }

    await decryptCollection('Patient', PatientModel)

    const steps = await StepModel.find({})
    for (const step of steps) {
        await decryptCollection(step.key, mongoose.model(step.key))
    }

    if (isDryRun) {
        log.info('\nDry run complete. No data was modified.')
        log.info('If the host/database above is the intended DEV cluster, re-run without --dry-run.')
    } else {
        log.info('\nMigration complete.')
        log.info('All documents are now stored unencrypted in MongoDB.')
        log.info('Next step: remove mongoose-encryption from the codebase (apps/backend).')
    }

    await mongoose.disconnect()
    process.exit(0)
}

main().catch(async (err) => {
    log.error('Migration failed:', err)
    await mongoose.disconnect()
    process.exit(1)
})
