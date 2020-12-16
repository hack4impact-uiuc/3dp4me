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
        const credentials = { 
            accessKeyId: "ASIA2CPQRHMYGCPK53R2", 
            authenticated: true, 
            identityId: "us-east-2:6046ac5f-5c14-4de3-b6d8-d984e4052c90", 
            secretAccessKey: "Z6ZIfhFhtP0c0ZdF7IyXCSBhfC9umf3FUeO0q1Vv", 
            sessionToken: "IQoJb3JpZ2luX2VjEGIaCXVzLWVhc3QtMiJHMEUCIHpaHVgzvF8M7DGSw6Hxvl6BUbDZaz6QWOwCc6UP0jOJAiEAqI6WcySaYqZtdscbEVHj+xESnJdbAAS+uCDVSr3O6WQqzQQI+///////////ARAAGgw2OTI1MzEwNTEzMTIiDA1NceCR95tTnQKhWyqhBPXoSWUMPAjpCEF++r5/KxjFPpABLZfGFWBPxjx5rWXu6pow4KxFYknBSCAwpvh1TeM+vL0Jd3kqDwLX8sRD0VcfYai9gJEqPFKTOvj8L8/uLMF61/Ku7HO97ouP0Jl6Rik70n5RXg3IaPWakyCi+bAWafWBZ3UfQR8IKOy3E+U5K1mNIaEFptnU9h/YCYuMOmSf2IRNAeATvnvjUGO662jMCoBo0Rz/4sr3pALRH5m7yP/VWSfRfrH+vM+bSrXZNqESg+NnP9x18P51cypjUUZUK6gxd2wXi33XbZshiawVKNHGE9HuC/7DlPJP9fyG17UMBLXvKZM1WHO25V4GJL2IcGCOPMKWXiem+dbTSHq4fBNreQNFtoAqXZB6uFrQ8YGLnz0xp+IEN//DZvhylCSauNYyz3vTmZgAnIMH/0BsFDOI8xg4rz3A6lH6EXrBBRFbFd+zPkGS18s2BqCaTElAF5FouQ5CER6dn0zXA+jOVmWzvzky7Y4uhS3EcxgHyWNsm/pTrbUt6RKQIVSMf/SZAIfu46ffbt+W3v/jLgQVORJLQRSioAlW7jFAU8VttHit2bmjqnfMdDy4imcjJjmZmrWCSA1HnK4Px4uypZRnpNauUlTuw9kDfVL9O0r3iCvJIWCmlrhO/ALiAeJOwACMOnobVrW0HMnkBn8Hsc2JZHw9TDxgay+JzEtJrNFbmtGXMDDQyR4R+MQq1TGIYoVNMNvN5f4FOoUCZ05nVHm+JZNMn0K9Io4OBYtFOpyBqEHb/RqJwbtdWK0q5+xYm5vTmOBGVQP/mgCqXvAX9RN0oU6z9/IU/42Pn1YTYYnOvRsTPWOHLfm1UPthytbuIpHa8NONpBH6Ds1XR6mP/UmEedAUFR8K4j/du5nMiHEr7SVcqzxju5otFF33tX4DBg8zVmvww3IKaVg/xBSFGfKzYBjd+VuhRlYdQAQzEj3FlrDuLqchJJnpR04v2r27YbHmCpnMvWlTJ4U29Xp1+o1kA2HQRcXz2GfmS6oluexuYhizbXKUIV7/PoYptPJzAh/oG75Mrx3PDTa8xWXIa5CXGpLbak6WzpRGcMQw1fA6"
        }
        //const {accessKeyId, authenticated, identityId, secretAccessKey, sessionToken} = req.body;
        //const credentials = {accessKeyId: accessKeyId, authenticated: authenticated, identityId: identityId, secretAccessKey: secretAccessKey, sessionToken: sessionToken};
        var s3Stream = downloadFile(`${patient.name}/${stage}/${filename}`, credentials).createReadStream();
        // Listen for errors returned by the service
        //res.attachment(filename);
        s3Stream.on('error', function(err) {
            // capture any errors that occur when writing data to the file
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
