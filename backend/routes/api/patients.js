const express = require("express");
const router = express.Router();
const { errorWrap } = require("../../utils");
<<<<<<< HEAD
const { models } = require("../../models");
const { uploadFile } = require("../../utils/aws/aws-s3-helpers");
=======
// const { models } = require("../../models");
>>>>>>> origin/aws-backend-auth

// TODO: Get all patients
router.get(
    '/',
    errorWrap(async (req, res) => {
<<<<<<< HEAD
        console.log("Getting patients")
        models.Patient.find().then(patients => res.status(200).json({
            code: 200, 
            success: true, 
            result: patients
        }));
=======
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        //     result: patients,
        // });
>>>>>>> origin/aws-backend-auth
    }),
);

// TODO: Get all patients in a stage
router.get(
    "/:stage",
    errorWrap(async (req, res) => {
<<<<<<< HEAD
        models.Patient.find().where('').then(patients => res.status(200).json({
            code: 200, 
            success: true, 
            result: patients
        }));
=======
>>>>>>> origin/aws-backend-auth
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        //     result: patients,
        // });
    }),
);

// TODO: Mark stage as complete for a patient
router.post(
    "/:id/:stage/complete",
    errorWrap(async (req, res) => {
        // res.status(200).json({
        //     code: 200,
        //     success: true,
        // });
<<<<<<< HEAD
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
=======
>>>>>>> origin/aws-backend-auth
    }),
);


module.exports = router;
