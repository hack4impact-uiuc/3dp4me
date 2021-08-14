const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const _ = require('lodash');
const { getStepKeys } = require('../../utils/patient-utils');
const { errorWrap } = require('../../utils');
const { models, overallStatusEnum } = require('../../models');
const { uploadFile, downloadFile } = require('../../utils/aws/aws-s3-helpers');
const {
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
} = require('../../utils/aws/aws-exports');
const { removeRequestAttributes } = require('../../middleware/requests');
const { isAdmin } = require('../../utils/aws/aws-user');
const {
    STEP_IMMUTABLE_ATTRIBUTES,
    PATIENT_IMMUTABLE_ATTRIBUTES,
} = require('../../utils/constants');

// GET: Returns all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        models.Patient.find().then((patientInfo) =>
            res.status(200).json({
                code: 200,
                success: true,
                result: patientInfo,
            }),
        );
    }),
);

// GET: Returns everything associated with patient
router.get(
    '/:id',
    errorWrap(async (req, res) => {
        const { id } = req.params;
        roles = [req.user.roles];
        let patientData = await models.Patient.findById(id);
        if (!patientData)
            return res.status(404).json({
                code: 404,
                message: `Patient with id ${id} not found`,
                success: false,
            });

        let stepKeys = await getStepKeys();
        let stepDataPromises = stepKeys.map(async (stepKey) => {
            if (isAdmin(req.user)) {
                steps = await models.Step.find({});
            } else {
                steps = await models.Step.find({
                    $and: [
                        { key: stepKey },
                        { readableGroups: { $in: [req.user.roles] } },
                    ],
                });
            }

            let readableFields = [];

            steps.map((step) => {
                step.fields = step.fields.filter((field) => {
                    return field.readableGroups.some((role) =>
                        roles.includes(role),
                    );
                });
            });

            steps.forEach((step) => {
                step.fields.forEach((field) => {
                    readableFields.push(field.key);
                });
            });

            let stepData = await mongoose
                .model(stepKey)
                .findOne({ patientId: id });
            if (stepData) stepData = stepData.toObject();

            if (!isAdmin(req.user))
                for (const [key, value] of Object.entries(stepData)) {
                    if (!readableFields.includes(key)) {
                        delete stepData[key];
                    }
                }

            patientData.set(stepKey, stepData, { strict: false });
        });

        await Promise.all(stepDataPromises);

        res.status(200).json({
            code: 200,
            success: true,
            result: patientData,
        });
    }),
);

// POST: new patient
router.post(
    '/',
    removeRequestAttributes(PATIENT_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        const patient = req.body;
        let new_patient = null;
        try {
            req.body.lastEditedBy = req.user.name;
            new_patient = new models.Patient(patient);
            await new_patient.save();
        } catch (error) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Request is invalid or missing fields.',
            });
        }

        res.status(201).json({
            code: 201,
            success: true,
            message: 'User successfully created.',
            result: new_patient,
        });
    }),
);

router.put(
    '/:id',
    removeRequestAttributes(PATIENT_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        const { id } = req.params;
        const patient = await models.Patient.findById(id);
        if (patient == null) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Patient with that id not found.',
            });
        }

        _.assign(patient, req.body);
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;

        const savedPatient = await patient.save();

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Patient successfully edited.',
            result: savedPatient,
        });
    }),
);

/**
 *
 * @param {*} user
 * @param {*} readable
 * @param {*} writable
 */
const getAccessibleFields = async (stepKey, user, readable, writable) => {
    let steps = null;
    if (isAdmin(user)) {
        steps = await models.Step.find({});
    } else {
        if (readable && writable)
            steps = await models.Step.find({
                $and: [
                    { key: stepKey },
                    {
                        $or: [
                            { readableGroups: { $in: user.roles } },
                            { writableGroups: { $in: user.roles } },
                        ],
                    },
                ],
            });
        else if (readable)
            steps = await models.Step.find({
                $and: [
                    { key: stepKey },
                    { readableGroups: { $in: user.roles } },
                ],
            });
        else if (writable)
            steps = await models.Step.find({
                $and: [
                    { key: stepKey },
                    { writableGroups: { $in: user.roles } },
                ],
            });
        else return [];

        steps.map((step) => {
            step.fields = step.fields.filter((field) => {
                return field.readableGroups.some((role) =>
                    user.roles.includes(role),
                );
            });
        });
    }

    let readableFields = [];

    steps.forEach((step) => {
        step.fields.forEach((field) => {
            readableFields.push(field.key);
        });
    });

    return readableFields;
};

// GET: Download a file
router.get(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey, fileName } = req.params;

        const readableFields = await getAccessibleFields(
            stepKey,
            req.user,
            true,
            false,
        );

        if (readableFields.includes(fieldKey)) {
            var s3Stream = downloadFile(
                `${id}/${stepKey}/${fieldKey}/${fileName}`,
                {
                    accessKeyId: ACCESS_KEY_ID,
                    secretAccessKey: SECRET_ACCESS_KEY,
                },
            ).createReadStream();

            s3Stream
                .on('error', function (err) {
                    res.json('S3 Error:' + err);
                })
                .on('close', function () {
                    res.end();
                });
            s3Stream.pipe(res);
        } else {
            return res.status(403).json({
                success: false,
                message: 'User does not have permissions to execute operation.',
            });
        }
    }),
);

// Delete: Delete a file
router.delete(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey, fileName } = req.params;

        const patient = await models.Patient.findById(id);
        if (patient == null) {
            return res.status(404).json({
                success: false,
                message: `Patient with id ${id} not found`,
            });
        }

        const model = await mongoose.model(stepKey);
        if (model == null) {
            return res.status(404).json({
                success: false,
                message: `Step with key ${stepKey} not found`,
            });
        }

        const stepData = await model.findOne({ patientId: id });
        if (stepData == null) {
            return res.status(404).json({
                success: false,
                message: `Patient does not have any data on record for this step`,
            });
        }
        const writableFields = await getAccessibleFields(
            stepKey,
            req.user,
            false,
            true,
        );
        if (!writableFields.includes(fieldKey)) {
            return res.status(403).json({
                success: false,
                message: `User does not have permissions to execute operation.`,
            });
        }

        const index = stepData[fieldKey].findIndex(
            (x) => x.filename == fileName,
        );

        if (index == -1) {
            return res.status(404).json({
                success: false,
                message: `File ${fileName} does not exist`,
            });
        }

        // TODO: Remove this file from AWS as well once we have a "do you want to remove this" on the frontend
        stepData[fieldKey].splice(index, 1);

        stepData.lastEdited = Date.now();
        stepData.lastEditedBy = req.user.name;
        await stepData.save();

        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        patient.save();

        res.status(200).json({
            success: true,
            message: 'File successfully removed',
        });
    }),
);

// POST: upload individual files
router.post(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        // TODO during refactoring: We upload file name in form data, is this even needed???
        const { id, stepKey, fieldKey, fileName } = req.params;
        const patient = await models.Patient.findById(id);

        if (patient == null) {
            return res.status(404).json({
                success: false,
                message: `Cannot find patient with id ${id}`,
            });
        }

        const collectionInfo = await mongoose.connection.db
            .listCollections({ name: stepKey })
            .toArray();

        if (collectionInfo.length == 0) {
            return res.status(404).json({
                success: false,
                message: `Step with key ${stepKey} not found`,
            });
        }

        const writableFields = await getAccessibleFields(
            stepKey,
            req.user,
            false,
            true,
        );
        if (!writableFields.includes(fieldKey))
            return res.status(403).json({
                success: false,
                message: 'User does not have permissions to execute operation.',
            });

        const model = await mongoose.model(stepKey);
        let stepData =
            (await model.findOne({ patientId: id })) || new model({});

        // Set ID in case patient does not have any information for this step yet
        stepData.patientId = id;
        if (!stepData || !stepData[fieldKey]) stepData[fieldKey] = [];

        let file = req.files.uploadedFile;
        await uploadFile(
            file.data,
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
            {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
        );

        stepData[fieldKey].push({
            filename: fileName,
            uploadedBy: req.user.name,
            uploadDate: Date.now(),
        });
        stepData.lastEdited = Date.now();
        stepData.lastEditedBy = req.user.name;
        await stepData.save();

        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save();

        res.status(201).json({
            success: true,
            message: 'File successfully uploaded',
            data: {
                name: fileName,
                uploadedBy: req.user.name,
                uploadDate: Date.now(),
                mimetype: file.mimetype,
                size: file.size,
            },
        });
    }),
);

// POST: Updates info for patient at stage
router.post(
    '/:id/:stage',
    removeRequestAttributes(STEP_IMMUTABLE_ATTRIBUTES),
    errorWrap(async (req, res) => {
        roles = [req.user.roles.toString()];
        const { id, stage } = req.params;
        let steps = null;
        if (isAdmin(req.user)) {
            steps = await models.Step.find({ key: stage });
        } else {
            steps = await models.Step.find({
                $and: [
                    { key: stage },
                    { writableGroups: { $in: [req.user.roles.toString()] } }, // Check this is correct req.user.roles is an array
                ],
            });
            let writableFields = [];

            steps.map((step) => {
                step.fields = step.fields.filter((field) => {
                    return field.writableGroups.some((role) =>
                        roles.includes(role),
                    );
                });
            });

            steps.forEach((step) => {
                writableFields.push(step.fields.key);
            });

            for (const [key, value] of Object.entries(req.body)) {
                if (!writableFields.includes(key)) {
                    delete req.body[key];
                }
            }
        }

        if (steps.length == 0) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Stage not found.',
            });
        }

        const patient = await models.Patient.findById(id);
        if (!patient) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Patient not found.',
            });
        }

        let model = mongoose.model(stage);
        let patientStepData = await model.findOne({ patientId: id });
        if (!patientStepData) {
            patientStepData = req.body;
            if (Object.keys(req.body) != 0) {
                patientStepData.lastEdited = Date.now();
                patientStepData.lastEditedBy = req.user.name;
            }

            patientStepData.patientId = id;
            const newStepDataModel = new model(patientStepData);
            patientStepData = await newStepDataModel.save();
        } else {
            patientStepData = _.assign(patientStepData, req.body);

            if (Object.keys(req.body) != 0) {
                patientStepData.lastEdited = Date.now();
                patientStepData.lastEditedBy = req.user.name;
            }
            patientStepData = await patientStepData.save();
        }

        // Doesn't update if step was not changed
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save();
        res.status(200).json({
            success: true,
            message: 'Patient Stage Successfully Saved',
            result: patientStepData,
        });
    }),
);

module.exports = router;
