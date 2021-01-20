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
        //const { userID, accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        const patient = req.body;
        try {
            console.log("here");
            let new_patient = new models.Patient(patient);
            new_patient.save(function (err, patient) {
                if (err) return console.error(err);
                console.log(patient);
            })
            // const resp = await models.Patient.insert(patient, () => {mongoose.connection.close()});
            console.log("inserted");
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
        //TODO: Replace these credential fields with one central credential object passed in
        const {accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        console.log(req);
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
                patient[stage].files.push({filename: file.name, uploadedBy: userID, uploadDate: Date.now()});
                patient.save();
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
