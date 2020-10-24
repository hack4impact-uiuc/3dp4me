const db = require("../pool.js");
const { getNextStage, getPrevStage } = require("../utils/patient-utils.js");

const getAllPatients = async () => {
    const sql = "SELECT * FROM patients";
    let res = await db.query(sql);
    return res.rows;
}

const getPatientsByStage = async (stage) => {
    const sql = "SELECT * FROM patients WHERE stage = $1";
    const params = [ stage ];
    let res = await db.query(sql, params);
    return res.rows;
}

const addPatient = async (patient_info) => {
    const query = "INSERT INTO patients VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)"
    const param = [patient_info.patient_name, patient_info.patient_address, 
        patient_info.folder, patient_info.reverted, 
        patient_info.stage, patient_info.info_completion, 
        patient_info.info_user_id, patient_info.scan_completion, 
        patient_info.scan_user_id, patient_info.model_completion, 
        patient_info.model_user_id, patient_info.printing_completion, 
        patient_info.printing_user_id, patient_info.delivery_completion, 
        patient_info.delivery_user_id, patient_info.feedback_completion, 
        patient_info.feedback_user_id, patient_info.last_touched, patient_info.last_user_touching]
    const res = await db.query(query, param);
    return res.rows[0];
}
    
const completeStage = async(userId, patientId, stage) => {
    var timestamp = new Date(); // TODO: change to how we need the timestamp to be formatted
    const timestampCol = `${stage}_completion`;
    const userIdCol = `${stage}_user_id`;
    const nextStage = getNextStage(stage);

    const sql = `UPDATE patients SET 
                    ${timestampCol} = $1,
                    reverted = false,
                    stage = $2,
                    ${userIdCol} = $3,
                    last_touched = $4, 
                    last_user_touching = $5
                WHERE patient_id = $6`;
    const params = [ timestamp, nextStage, userId, timestamp, userId, patientId ];
    await db.query(sql, params);
}

const revertStage = async(userId, patientId, currStage, notes) => {
    var timestamp = new Date(); // TODO: change to how we need the timestamp to be formatted
    const currTimestampCol = `${currStage}_completion`;
    const currUserIdCol = `${currStage}_user_id`;
    const prevStage = getPrevStage(currStage);

    
    const folder = getPatientFolder(patientId);
    // TODO: Update notes in s3 folder associated with patient for notes regarding why the revert happened
    
    const sql = `UPDATE patients SET 
                    ${currTimestampCol} = NULL,
                    reverted = true,
                    stage = $1,
                    ${currUserIdCol} = NULL,
                    last_touched = $2,
                    last_user_touching = $3
                WHERE patient_id = $4`;
    const params = [ prevStage, timestamp ,userId, patientId];
    await db.query(sql, params);
}

const getPatientFolder = (patientId) => {
    const sql = 'SELECT folder from patients WHERE patient_id = $1'
    const params = [patientId]
    const res = db.query(sql, params);
    return res[0];
}

module.exports = {
    getAllPatients,
    getPatientsByStage,
    addPatient,
    completeStage,
    revertStage
}