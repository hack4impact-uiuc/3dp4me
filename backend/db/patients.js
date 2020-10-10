const db = require("../pool.js");
const { getNextStage } = require("../utils/patient-utils.js");

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

const completeStage = async(id, stage) => {
    var timestamp = new Date(); // TODO: change to how we need the timestamp to be formatted
    const timstampCol = `${stage}_completion`;
    const nextStage = getNextStage(stage);

    const sql = `UPDATE patients SET 
                    ${timstampCol} = $1,
                    reverted = false,
                    stage = $2
                WHERE patient_id = $3`;
    const params = [ timestamp, nextStage, id ];
    await db.query(sql, params);
}

module.exports = {
    getAllPatients,
    getPatientsByStage,
    completeStage,
}