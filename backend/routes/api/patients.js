const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");
const { uploadFile } = require("../../utils/aws/aws-s3-helpers");


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

// Edit a patient's status
router.put(
    '/:id/:stage/status',
    errorWrap(async (req, res) => {
        const { status, userID, notes } = req.body;
        const { id, stage } = req.params;
        if (req.files) {
            // TODO: Upload new files to AWS and update files field in model
        }

        const patient = await models.Patient.findById(id);
        patient[stage].status = status;
        patient[stage].lastEdit = Date.now();
        patient[stage].lastEditBy = userID;
        patient[stage].notes = notes;
        await patient.save(function() {
            res.status(200).json({
                code: 200,
                success: true,
                result: patient,
            });
        })
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

// POST: Uploads files for certain stage and updates info
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            const { id, stage } = req.params;
            const { userID, accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body
            let file = req.files.uploadedFile;  //TODO: use name of input field possibly?
            const patient = await models.Patient.findById(id);
            patient[stage].lastEdit = Date.now();
            patient[stage].lastEditBy = userID;
            patient[stage].files.push({filename: file.name, uploadedBy: userID, uploadDate: new Date()});
            await uploadFile(file.data, `${patient.name}/${file.name}`, {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken}, function(err, data) {
                if(!err) {
                    res.json(`upload ${file.name} to S3 complete`);
                } else {
                    res.json(err)
                }
            })
            await patient.save(function(err){
                if(err){
                    res.json(err)
                } else {
                    res.json({
                        message: 'File is uploaded',
                        data: {
                            name: file.name,
                            mimetype: file.mimetype,
                            size: file.size
                        }
                    });
                }
            });
        }
    }),
);


module.exports = router;
