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
                success: false,
            });
        else
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

        try {
            const new_patient = new models.Patient(patient);
            const saved_patient = await new_patient.save();
        } catch (error) {
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
            data: saved_patient,
        });
    }),
);

// GET: Download a file
router.get(
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        //TODO: change it so that you can pass user aws credentials in a more secure manner
        var s3Stream = downloadFile(`${id}/${stage}/${filename}`, {
            accessKeyId: req.headers.accesskeyid,
            secretAccessKey: req.headers.secretaccesskey,
            sessionToken: req.headers.sessiontoken,
        }).createReadStream();
        // Listen for errors returned by the service
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
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        const patient = await models.Patient.findById(id);
        let index = patient[stage].files.findIndex(
            (x) => x.filename == filename,
        );
        if (index > -1) {
            patient[stage].files.splice(index, 1);
        }
        // TODO: Remove this file from AWS as well
        patient.lastEdited = Date.now();
        patient.save();
        res.status(201).json({
            success: true,
            message: 'Patient status updated with file removed',
        });
    }),
);

// POST: upload individual files
router.post(
    '/:id/:stage/file',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: change it so that you can pass user aws credentials in a more secure manner
        const {
            uploadedFileName,
            accessKeyId,
            secretAccessKey,
            sessionToken,
        } = req.body;
        const patient = await models.Patient.findById(id);
        let file = req.files.uploadedFile;
        uploadFile(
            file.data,
            `${id}/${stage}/${uploadedFileName}`,
            {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey,
                sessionToken: sessionToken,
            },
            function (err, data) {
                if (err) {
                    res.json(err);
                } else {
                    // update database only if upload was successful
                    patient[stage].files.push({
                        filename: uploadedFileName,
                        uploadedBy: req.user.Username,
                        uploadDate: Date.now(),
                    });
                    patient.lastEdited = Date.now();
                    patient.save();
                    res.status(201).json({
                        success: true,
                        message: 'Patient status updated with new file',
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
