const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models } = require('../../models');
const { uploadFile, downloadFile } = require('../../utils/aws/aws-s3-helpers');

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
const getStepKeys = async () => {
    const steps = await models.Step.find({});
    let stepKeys = [];
    steps.forEach((element) => stepKeys.push(element.key));
    return stepKeys;
};

// GET: Returns everything associated with patient
router.get(
    '/:id',
    errorWrap(async (req, res) => {
        const { id } = req.params;
        let patientData = await models.Patient.findById(id);
        let stepKeys = await getStepKeys();

        for (const stepKey of stepKeys) {
            const collection = await mongoose.connection.db.collection(stepKey);
            const stepData = await collection.findOne({ patientId: id });
            patientData.set(stepKey, stepData, { strict: false });
        }

        if (!patientData)
            res.status(404).json({
                code: 404,
            });
    }),
);

// GET: Returns everything associated with patient stage
router.get(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        // TODO: Just query for the stage data only
        const patientData = await models.Patient.findById(id, stage);
        const stageData = patientData[stage];
        res.status(200).json({
            code: 200,
            success: true,
            result: stageData,
        });
    }),
);

// POST: new patient
// TODO: Implement and test
router.post(
    '/',
    errorWrap(async (req, res) => {
        const patient = req.body;
        try {
            const new_patient = new models.Patient(patient);
            const saved_patient = await _patient.save();
        } catch (err) {
            // TODO: Validate patient and send back good error message
            res.status(500).send({});
        }

        res.status(SUCCESS).send({
            code: SUCCESS,
            success: true,
            message: 'User successfully created.',
            data: resp,
        });
    }),
);

// GET: Download a file
router.get(
    '/:id/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey, fileName } = req.params;
        var s3Stream = downloadFile(
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
            {
                accessKeyId: req.headers.accesskeyid,
                secretAccessKey: req.headers.secretaccesskey,
                sessionToken: req.headers.sessiontoken,
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
    }),
);

// Delete: Delete a file
router.delete(
    '/:id/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey, fileName } = req.params;

        const patient = await models.Patient.findById(id);
        if (patient == null) {
            return res.status(404).json({
                success: false,
                message: `Patient with id ${id} not found`,
            });
        }

        const collection = await mongoose.connection.db.collection(stepKey);
        if (collection == null) {
            return res.status(404).json({
                success: false,
                message: `Step with key ${stepKey} not found`,
            });
        }

        const stepData = await collection.findOne({ patientId: id });
        if (stepData == null) {
            return res.status(404).json({
                success: false,
                message: `Patient does not have any data on record for this step`,
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
        stepData.lastEditedBy = req.user.Username;
        collection.findOneAndUpdate({ patientId: id }, { $set: stepData });

        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.Username;
        patient.save();

        res.status(201).json({
            success: true,
            message: 'File successfully removed',
        });
    }),
);

// POST: upload individual files
router.post(
    '/:id/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey } = req.params;
        const {
            uploadedFileName,
            accessKeyId,
            secretAccessKey,
            sessionToken,
        } = req.body;

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

        const collection = await mongoose.connection.db.collection(stepKey);
        let stepData = await collection.findOne({ patientId: id });
        const doesPatientHaveData = stepData != null;

        // If the admin adds a new step after the user was added, then the stepData will not be found.
        if (!doesPatientHaveData) {
            stepData = { [fieldKey]: [], patientId: id };
        }

        let file = req.files.uploadedFile;
        uploadFile(
            file.data,
            `${id}/${stepKey}/${fieldKey}/${uploadedFileName}`,
            {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                sessionToken: sessionToken,
            },
            async function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    stepData[fieldKey].push({
                        filename: uploadedFileName,
                        uploadedBy: req.user.Username,
                        uploadDate: Date.now(),
                    });
                    stepData.lastEdited = Date.now();
                    stepData.lastEditedBy = req.user.Username;
                    collection.findOneAndUpdate(
                        { patientId: id },
                        { $set: stepData },
                        { upsert: true },
                    );

                    patient.lastEdited = Date.now();
                    patient.lastEditedBy = req.user.Username;
                    patient.save();

                    res.status(201).json({
                        success: true,
                        message: 'File successfully uploaded',
                        data: {
                            name: uploadedFileName,
                            uploadedBy: req.user.Username,
                            uploadDate: Date.now(),
                            mimetype: file.mimetype,
                            size: file.size,
                        },
                    });
                }
            },
        );
    }),
);

// POST: Updates info for patient at stage
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: Add auth check for permissions
        const updatedStage = req.body;
        const patient = await models.Patient.findById(id);

        // TODO: Check that patient returned exists
        //TODO: use name of input field possibly?
        patient.lastEdited = Date.now();
        patient[stage] = updatedStage;
        patient[stage].lastEdited = Date.now();
        patient[stage].lastEditedBy = req.user.Username;
        await patient.save(function (err) {
            if (err) {
                res.json(err); //TODO: bug here, need to take a look
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Patient Stage Successfully Saved',
                    result: patient,
                });
            }
        });
    }),
);

module.exports = router;
