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
)

// POST: Uploads files for certain stage and updates info
router.post(
    '/:id/:stage',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        const { userID, accessKeyId, authenticated, identityId, secretAccessKey, sessionToken, status, notes} = req.body
        const patient = await models.Patient.findById(id);
        if(req.files) {
            let file = req.files.uploadedFile;
            patient[stage].files.push({filename: file.name, uploadedBy: userID, uploadDate: new Date()});
            await uploadFile(file.data, `${patient.name}/${file.name}`, {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken}, function(err, data) {
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
        await patient.save(function(err){
            if(err){
                res.json(err)
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
