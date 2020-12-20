const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");
const { uploadFile, downloadFile } = require("../../utils/aws/aws-s3-helpers");

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

// GET: Returns everything associated with patient stage
router.get(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        models.Patient.findById(id, stage).then(stageInfo => {
            res.status(200).json({
                code: 200, 
                success: true, 
                result: stageInfo[stage]
            });
        });
    }),
);

router.get(
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        //TODO: Replace these credential fields with one central credential object passed in
        const {accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        const credentials = {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken};
        var s3Stream = downloadFile(`${id}/${stage}/${filename}`, credentials).createReadStream();
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

// POST: upload individual files
router.post(
    '/:id/:stage/file',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: Replace these credential fields with one central credential object passed in
        const { userID, accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        const patient = await models.Patient.findById(id);
        let file = req.files.uploadedFile;
        uploadFile(file.data, `${id}/${stage}/${file.name}`, {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken}, function(err, data) {
            if(err) {
                res.json(err)
            } else {
                // update database only if upload was successful
                patient[stage].files.push({filename: file.name, uploadedBy: userID, uploadDate: new Date()});
                res.status(201).json({
                    success: true,
                    message: 'Patient status updated with new file',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    }
                });
            }
        });
    })
);

// POST: Uploads files for certain stage and updates info
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: Add auth check for permissions
        const { userID, updatedStage} = req.body;
        const patient = await models.Patient.findById(id);

        //TODO: use name of input field possibly?
        patient.lastEdited = Date.now();
        patient[stage] = updatedStage;
        patient[stage].lastEdited = Date.now();
        patient[stage].lastEditedBy = userID;
        await patient.save(function(err){
            if(err){
                res.json(err) //TODO: bug here, need to take a look
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
