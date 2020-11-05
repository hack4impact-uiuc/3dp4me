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

        let update = {
            [stage]: {
                "status": status,
                "lastEdit": Date.now(),
                "lastEditBy": userID,
                "notes": notes
            }
        }
        if (req.files) {
            // TODO: Upload new files to AWS and update files field in model
        }

        const updatedPatient = await models.Patient.findById(id, update, { new: true });
        res.status(200).json({
            code: 200,
            success: true,
            result: updatedPatient,
        });
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
            result: stageInfo
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
            const { userId, userName } = req.body
            const patientStage = models.Patient.findById(id, stage);
            const currDate = new Date();
            let file = req.files.uploadedFile;  //TODO: use name of input field possibly?

            patientStage.lastEdit = currDate;
            patientStage.lastEditBy = userName;
            patientStage.files.push({filename: file.name,
                uploadedBy: userName,
                uploadDate: currDate});
            await patientStage.save();
            
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    }),
);


module.exports = router;
