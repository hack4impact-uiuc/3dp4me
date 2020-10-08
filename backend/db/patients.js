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

module.exports = {
    getAllPatients,
    getPatientsByStage,
}