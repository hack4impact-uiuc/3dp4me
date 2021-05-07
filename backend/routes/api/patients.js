const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { errorWrap } = require('../../utils');
const { models, overallStatusEnum } = require('../../models');
const { uploadFile, downloadFile } = require('../../utils/aws/aws-s3-helpers');
const {
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
} = require('../../utils/aws/aws-exports');

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
        if (!patientData)
            return res.status(404).json({
                code: 404,
                message: `Patient with id ${id} not found`,
                success: false,
            });

        let stepKeys = await getStepKeys();
        for (const stepKey of stepKeys) {
            const collection = await mongoose.connection.db.collection(stepKey);
            const stepData = await collection.findOne({ patientId: id });
            patientData.set(stepKey, stepData, { strict: false });
        }

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
    errorWrap(async (req, res) => {
        const patient = req.body;
        let new_patient = null;
        try {
            req.body.lastEditedBy = req.user.name;
            new_patient = new models.Patient(patient);
            await new_patient.save();
        } catch (error) {
            console.log(error);
            return res.status(401).json({
                code: 401,
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
    errorWrap(async (req, res) => {
        const { id } = req.params;
        const patient = await models.Patient.findOneAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true },
        );

        if (patient == null) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Patient with that id not found.',
            });
        }

        res.status(200).json({
            code: 200,
            success: true,
            message: 'Patient successfully edited.',
            data: patient,
        });
    }),
);

// GET: Download a file
router.get(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
        const { id, stepKey, fieldKey, fileName } = req.params;
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
        stepData.lastEditedBy = req.user.name;
        collection.findOneAndUpdate({ patientId: id }, { $set: stepData });

        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        patient.save();

        res.status(201).json({
            success: true,
            message: 'File successfully removed',
        });
    }),
);

// POST: upload individual files
router.post(
    '/:id/files/:stepKey/:fieldKey/:fileName',
    errorWrap(async (req, res) => {
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

        const collection = await mongoose.connection.db.collection(stepKey);
        let stepData = (await collection.findOne({ patientId: id })) || {};

        // Set ID in case patient does not have any information for this step yet
        stepData.patientId = id;
        if (!stepData || !stepData[fieldKey]) stepData[fieldKey] = [];

        let file = req.files.uploadedFile;
        uploadFile(
            file.data,
            `${id}/${stepKey}/${fieldKey}/${fileName}`,
            {
                accessKeyId: ACCESS_KEY_ID,
                secretAccessKey: SECRET_ACCESS_KEY,
            },
            await async function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    stepData[fieldKey].push({
                        filename: fileName,
                        uploadedBy: req.user.name,
                        uploadDate: Date.now(),
                    });
                    stepData.lastEdited = Date.now();
                    stepData.lastEditedBy = req.user.name;
                    collection.findOneAndUpdate(
                        { patientId: id },
                        { $set: stepData },
                        { upsert: true },
                    );

                    patient.lastEdited = Date.now();
                    patient.lastEditedBy = req.user.name;
                    patient.save();

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
        const steps = await models.Step.find({ key: stage });
        const session = await mongoose.startSession();

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

        const updatedStage = req.body;
        let savedData = null;
        try {
            await session.withTransaction(async () => {
                const collection = await mongoose.connection.db.collection(
                    stage,
                );
                updatedStage.lastEdited = Date.now();
                updatedStage.lastEditedBy = req.user.name;
                delete updatedStage._id;
                let model = mongoose.model(stage);
                console.log(updatedStage);
                const updatedModel = new model(updatedStage);
                savedData = await collection.findOneAndUpdate(
                    { patientId: id },
                    { $set: updatedModel },
                    {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true,
                        returnOriginal: false,
                    },
                );
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                code: 500,
                success: false,
                message: error,
            });
        }
        patient.lastEdited = Date.now();
        patient.lastEditedBy = req.user.name;
        await patient.save(function (err) {
            if (err) {
                res.json(err); //TODO: bug here, need to take a look
            } else {
                res.status(200).json({
                    success: true,
                    message: 'Patient Stage Successfully Saved',
                    result: savedData.value,
                });
            }
        });
    }),
);

module.exports = router;
