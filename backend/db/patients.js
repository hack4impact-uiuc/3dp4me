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

const addPatient = async (id, name, address, reverted, info_completion, info_user_id, scan_completion, scan_user_id, model_completion, model_user_id, printing_completion, printing_user_id, delivery_completion, delivery_user_id, feedback_completion, feedback_user_id, Last_touched, last_user_touching) => {
    try { 
        const query = "INSERT INTO patients VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)"
        const param = [id, name, address, reverted, info_completion, info_user_id, scan_completion, scan_user_id, model_completion, model_user_id, printing_completion, printing_user_id, delivery_completion, delivery_user_id, feedback_completion, feedback_user_id, Last_touched, last_user_touching]
        const res = await db.query(query, param);
        return res.rows[0];
    } catch (err) {
        return err.stack;
    }
}

module.exports = {
    getAllPatients,
    getPatientsByStage,
    addPatient,
}