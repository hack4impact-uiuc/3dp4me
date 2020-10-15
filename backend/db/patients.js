const db = require("../pool.js");

const getAllPatients = async () => {
    const sql = "SELECT * FROM patients";
    let res = await db.query(sql);
    return res.rows;
}

const getPatientsByStage = async (stage) => {
    const sql = "SELECT * FROM patients WHERE current_stage = $1";
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

module.exports = {
    getAllPatients,
    getPatientsByStage,
    addPatient,
}