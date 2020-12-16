const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");
const { uploadFile, downloadFile } = require("../../utils/aws/aws-s3-helpers");
const fs = require('fs');

// Get all patients (query parameter "stage")
router.get(
    '/',
    errorWrap(async (req, res) => {
        console.log("Getting patients")
        models.Patient.find().then(patients => res.status(200).json({
            code: 200, 
            success: true, 
            result: patients
        }));
    }),
);

// GET: Returns everything associated with patient stage
router.get(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        models.Patient.findById(id, stage).then(stageInfo => res.status(200).json({
            code: 200, 
            success: true, 
            result: stageInfo[stage]
        }));
    }),
);

// GET: Returns everything associated with patient
router.get(
    '/:id',
    errorWrap(async (req, res) => {
        const { id } = req.params;
        models.Patient.findById(id).then(patientInfo => res.status(200).json({
            code: 200, 
            success: true, 
            result: patientInfo
        }));
    }),
);

router.get(
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        const patient = await models.Patient.findById(id).catch(error => {
            error.statusCode = 400;
            next(error);
        });
         //TODO: Replace these credential fields with one central credential object passed in
        const {accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        const credentials = {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken};
        var s3Stream = downloadFile(`${patient.name}/${stage}/${filename}`, credentials).createReadStream();
        // Listen for errors returned by the service
        s3Stream.on('error', function(err) {
            res.json('S3 Error:' + err);
        }).on('close', function() {
            res.end();
            console.log('Done.');
        });
        s3Stream.pipe(res);
    })
);


// POST: Uploads files for certain stage and updates info
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: Replace these credential fields with one central credential object passed in
        const { userID, status, notes, accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body
        const patient = await models.Patient.findById(id);
        if(req.files) {
            let file = req.files.uploadedFile;
            patient[stage].files.push({filename: file.name, uploadedBy: userID, uploadDate: new Date()});
            uploadFile(file.data, `${patient.name}/${stage}/${file.name}`, {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken}, function(err, data) {
                if(err) {
                    res.json(err)
                }
            })
        } 
        //TODO: use name of input field possibly?
        patient[stage].lastEdit = Date.now();
        patient[stage].lastEditBy = userID;
        patient[stage].status = status;
        patient[stage].notes = notes;
        await patient[stage].save(function(err){
            if(err){
                res.json(err) //TODO: bug here, need to take a look
            } else {
                if(req.files) {
                    res.status(201).json({
                        success: true,
                        message: 'Patient status updated with new file',
                        data: {
                            name: file.name,
                            mimetype: file.mimetype,
                            size: file.size
                        }
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Patient updated without fileupload',
                        result: patient,
                    });
                }
            }
        });
        
    }),
);


module.exports = router;
