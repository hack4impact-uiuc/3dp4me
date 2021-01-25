const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
const { models } = require("../../models");
const { uploadFile, downloadFile } = require("../../utils/aws/aws-s3-helpers");

// GET: Returns all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
        
        models.Patient.find().then(patientInfo => res.status(200).json({
            code: 200, 
            success: true, 
            result: patientInfo
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

// POST: new patient
router.post(
    '/',
    // validate({ body: models.Patient }),
    errorWrap(async (req, res) => {
        const patient = req.body;
        try {
            let new_patient = new models.Patient(patient);
            new_patient.save(function (err, patient) {
                if (err) return console.error(err);
            })
            res.status(SUCCESS).send({
              code: SUCCESS,
              success: true,
              message: "User successfully created.",
              data: resp
            });
          } catch (err) {
            return err;
          }
}));

// GET: Download a file
router.get(
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        //TODO: change it so that you can pass user aws credentials in a more secure manner
        var s3Stream = downloadFile(`${id}/${stage}/${filename}`, {accessKeyId: req.headers.accesskeyid, secretAccessKey: req.headers.secretaccesskey, sessionToken: req.headers.sessiontoken}).createReadStream();
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

// Delete: Delete a file
router.delete(
    '/:id/:stage/:filename',
    errorWrap(async (req, res) => {
        const { id, stage, filename } = req.params;
        const patient = await models.Patient.findById(id);
        let index = patient[stage].files.findIndex(x => x.filename==filename); 
        if (index > -1) {
            patient[stage].files.splice(index, 1);
        }
        patient.lastEdited = Date.now();
        patient.save();
        res.status(201).json({
            success: true,
            message: 'Patient status updated with file removed'
        });
    })
);


// POST: upload individual files
router.post(
    '/:id/:stage/file',
    errorWrap(async (req, res) => {
        const { id, stage } = req.params;
        //TODO: change it so that you can pass user aws credentials in a more secure manner
        const { uploadedFileName, accessKeyId, secretAccessKey,sessionToken} = req.body;
        const patient = await models.Patient.findById(id);
        let file = req.files.uploadedFile;
        console.log(req.user.Username);
        uploadFile(file.data, `${id}/${stage}/${uploadedFileName}`, {accessKeyId: accessKeyId, secretAccessKey: secretAccessKey, sessionToken: sessionToken}, function(err, data) {
            if(err) {
                res.json(err)
            } else {
                // update database only if upload was successful
                patient[stage].files.push({filename: uploadedFileName, uploadedBy: req.user.Username, uploadDate: Date.now()});
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
                        size: file.size
                    }
                });
            }
        });
    })
);

// POST: Updates info for patient at stage
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
