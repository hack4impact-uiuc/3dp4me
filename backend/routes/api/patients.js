const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const _ = require('lodash');

const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const {
    uploadFile, downloadFile, deleteFile, deleteFolder,
} = require('../../utils/aws/awsS3Helpers');
const { removeRequestAttributes } = require('../../middleware/requests');
const {
    STEP_IMMUTABLE_ATTRIBUTES,
    PATIENT_IMMUTABLE_ATTRIBUTES,
} = require('../../utils/constants');
const { sendResponse, getDataFromModelWithPaginationAndSearch } = require('../../utils/response');
const { getReadableSteps } = require('../../utils/stepUtils');
const { getStepBaseSchemaKeys } = require('../../utils/initDb');
const {
    isFieldReadable,
    isFieldWritable,
    getWritableFields,
} = require('../../utils/fieldUtils');
const { generateOrderId } = require('../../utils/generateOrderId');

/**
 * Returns everything in the patients collection (basic patient info)
 */
router.get(
    '/',
    errorWrap(async (req, res) => {
        const patientData = await getDataFromModelWithPaginationAndSearch(req, models.Patient);
        await sendResponse(res, 200, '', patientData);
    }),
);

/**
 * Returns the count of documents in the patients collection
 */

router.get(
    '/count',
    errorWrap(async (req, res) => {
        const patientCount = await models.Patient.count();
        return sendResponse(res, 200, 'success', patientCount);
    }),
);

/**
 * Returns all of our data on a specific patient. Gets both the basic info
 * from the Patient collection and the data from each step.
 * */
router.get(
    '/:id',
    errorWrap(async (req, res) => {
        const { id } = req.params;

        // Check if patient exists
        const patientData = await models.Patient.findById(id);
        if (!patientData) return sendResponse(res, 404, `Patient with id ${id} not found`);

        // Get all steps/fields that the user is allowed to view
        const steps = await getReadableSteps(req);

        // Create promises for each step so that we can do this in parallel
        const stepDataPromises = steps.map(async (step) => {
            // Get all patient data for this step
            let stepData = await mongoose
                .model(step.key)
                .findOne({ patientId: id });

            // If the patient doesn't have data for this step yet, set it to null
            if (!stepData) {
                patientData.set(step.key, null, { strict: false });
                return;
            }

            // The user can read any field returned by getReadableSteps
            let readableFields = step.fields.map((f) => f.key);
            readableFields = readableFields.concat(getStepBaseSchemaKeys());
            stepData = stepData.toObject();

            // Filter out fields that the user cannot view
            stepData = _.pick(stepData, readableFields);

            // Update the patient data
            patientData.set(step.key, stepData, { strict: false });
        });

        // Execute all the promises
        await Promise.all(stepDataPromises);
        return sendResponse(res, 200, 'success', patientData);
    }),
);

/**
 * Creates a new patient. Stores all the basic patient info in the Patient collection. Step
 * data isn't created until a PUT is made for each step.
 */
router.post(
    '/',
    removeRequestAttributes(PATIENT_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        const patient = req.body;
        let newPatient = null;

        try {
            req.body.lastEditedBy = req.user.name;

            await mongoose.connection.transaction(async (session) => {
                patient.orderId = await generateOrderId(session);
                newPatient = new models.Patient(patient);
                await newPatient.save({ session });
            });
        } catch (error) {
            return sendResponse(res, 400, `Bad request: ${error}`);
        }

        return sendResponse(res, 201, 'User created', newPatient);
    }),
);

/**
 * Updates the patients information in the Patient collection.
 * Note: This DOES NOT update the info for individual steps.
 */
router.put(
    '/:id',
    removeRequestAttributes(PATIENT_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        const { id } = req.params;
        const patient = await models.Patient.findById(id);
        if (!patient) return sendResponse(res, 404, `Patient "${id}" not found`);

        // Copy over the attributes from the request
        _.assign(patient, req.body);
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;

        // Update the patient
        const savedPatient = await patient.save();
        return sendResponse(res, 200, 'Patient updated', savedPatient);
    }),
);

/**
 * Streams a file from the S3 bucket to the client. The request URL
 * params must specify the ID of the patient, the step where the file is located,
 * the fieldKey for the file array, and the file name itself.
 */
router.get(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const {
            id, stepKey, fieldKey, fileName,
        } = req.params;

        const isReadable = await isFieldReadable(req.user, stepKey, fieldKey);
        if (!isReadable) {
            sendResponse(res, 403, 'Insufficient permissions');
            return;
        }

        // Open a stream from the S3 bucket
        const s3Stream = downloadFile(
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
        ).createReadStream();

        // Setup callbacks for stream error and stream close
        s3Stream
            .on('error', (err) => {
                res.json(`S3 Error:${err}`);
            })
            .on('close', () => {
                res.end();
            });

        // Pipe the stream to the client
        s3Stream.pipe(res);
    }),
);

/**
 * Deletes a file from the DB so that it no longer shows up in the dashboard.
 * Note that this currently does not delete the file from the S3, that must be
 * done manually through the AWS website.
 */
router.delete(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const {
            id, stepKey, fieldKey, fileName,
        } = req.params;

        // Get patient
        const patient = await models.Patient.findById(id);
        if (!patient) return sendResponse(res, 404, `Patient (${id}) not found`);

        // Get model
        let model;
        try {
            model = mongoose.model(stepKey);
        } catch (error) {
            return sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        // Make sure user has permission to delete file
        const isWritable = await isFieldReadable(req.user, stepKey, fieldKey);
        if (!isWritable) return sendResponse(res, 403, 'Insufficient permission');

        // Get step data
        const stepData = await model.findOne({ patientId: id });
        if (!stepData) return sendResponse(res, 404, 'File does not exist');

        // Get the file
        const index = stepData[fieldKey].findIndex(
            (x) => x.filename === fileName,
        );

        if (index === -1) {
            return sendResponse(res, 404, `File "${fileName}" does not exist`);
        }

        // Remove the file from Mongo tracking
        stepData[fieldKey].splice(index, 1);

        // Update step's last edited
        stepData.lastEdited = Date.now();
        stepData.lastEditedBy = req.user.name;
        await stepData.save();

        // Update patient's last edited
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save();

        // Remove this file from AWS as well
        await deleteFile(
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
        );

        return sendResponse(res, 200, 'File deleted');
    }),
);

/**
 * Uploads an individual file to S3 and records it in the DB.
 * URL format similar to GET file.
 */
router.post(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        // TODO during refactoring: We upload file name in form data, is this even needed???
        const {
            id, stepKey, fieldKey, fileName,
        } = req.params;
        const patient = await models.Patient.findById(id);

        // Make sure patient exists
        if (!patient) return sendResponse(res, 404, `Cannot find patient "${id}"`);

        // Make sure step exists
        let Model;
        try {
            Model = mongoose.model(stepKey);
        } catch (error) {
            return sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        // Make sure file is writable
        const isWritable = await isFieldWritable(req.user, stepKey, fieldKey);
        if (!isWritable) return sendResponse(res, 403, 'Insufficient permission');

        // Get patient's data for this step. If patient has no data, construct it with the model.
        let stepData = await Model.findOne({ patientId: id });
        if (!stepData) stepData = new Model({});

        // Set ID in case patient does not have any information for this step yet
        stepData.patientId = id;
        if (!stepData[fieldKey]) stepData[fieldKey] = [];

        // Upload the file to the S3
        const file = req.files.uploadedFile;
        await uploadFile(
            file.data,
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
        );

        // Record this file in the DB
        stepData[fieldKey] = [
            ...stepData[fieldKey],
            {
                filename: fileName,
                uploadedBy: req.user.name,
                uploadDate: new Date(),
            },
        ];

        // TODO: Make this a middleware
        // Update step's last edited
        stepData.lastEdited = Date.now();
        stepData.lastEditedBy = req.user.name;
        await stepData.save();

        // Update patient's last edited
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save();

        // Send the response
        const respData = {
            name: fileName,
            uploadedBy: req.user.name,
            uploadDate: Date.now(),
            mimetype: file.mimetype,
            size: file.size,
        };
        return sendResponse(res, 201, 'File uploaded', respData);
    }),
);

/**
 * Updates (or creates) the patients data for an individual step. The URL must contain
 * the patient's ID and the stepKey to update.
 */
router.post(
    '/:id/:stepKey',
    removeRequestAttributes(STEP_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        const { id, stepKey } = req.params;

        // Make sure patient exists
        const patient = await models.Patient.findById(id);
        if (!patient) return sendResponse(res, 404, `Patient "${id}" not found`);

        // Filter out request fields that the user cannot write
        const writableFields = await getWritableFields(req.user, stepKey);
        req.body = _.pick(req.body, writableFields);

        // Find the patient's step data
        let Model;
        try {
            Model = mongoose.model(stepKey);
        } catch (error) {
            return sendResponse(res, 404, `Step "${stepKey}" not found`);
        }

        // Update the data
        let patientStepData = await updatePatientStepData(id, Model, req.body);

        // Update step data last edited
        patientStepData.lastEdited = Date.now();
        patientStepData.lastEditedBy = req.user.name;
        patientStepData = await patientStepData.save();

        // Update patient last edited
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save();

        return sendResponse(res, 200, 'Step updated', patientStepData);
    }),
);

/**
 * Deletes all of the patient's data from the database.
 */
router.delete(
    '/:id',
    errorWrap(async (req, res) => {
        const { id } = req.params;

        // Makes sure patient exists
        let patient;
        try {
            patient = await models.Patient.findById(id);
        } catch {
            return sendResponse(res, 404, `${id} is not a valid patient id`);
        }

        if (!patient) return sendResponse(res, 404, `Patient "${id}" not found`);

        // Deletes the patient from the Patient Collection
        await models.Patient.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) });

        const allStepKeys = await models.Step.find({}, 'key');

        // Create array of promises to speed this up a bit
        const lookups = allStepKeys.map(async (stepKeyData) => {
            let Model;
            const stepKey = stepKeyData.key;
            try {
                Model = mongoose.model(stepKey);
                // eslint-disable-next-line no-await-in-loop
                await Model.findOneAndDelete({ patientId: id });
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`DELETE /patients/:id - step ${stepKey} not found`);
                return false;
            }
            return true;
        });

        // Deletes the patient from each Steps's Collection
        await Promise.all(lookups);

        // Deletes the patient's files from the AWS S3 bucket
        await deleteFolder(id);

        return sendResponse(res, 200, 'Deleted patient');
    }),
);

const updatePatientStepData = async (patientId, StepModel, data) => {
    let patientStepData = await StepModel.findOne({ patientId });

    // If patient doesn't have step data, create it with constructor. Else update it.
    if (!patientStepData) {
        patientStepData = data;
        patientStepData.patientId = patientId;

        const newStepDataModel = new StepModel(patientStepData);
        return newStepDataModel.save();
    }

    patientStepData = _.assign(patientStepData, data);
    return patientStepData.save();
};

module.exports = router;
