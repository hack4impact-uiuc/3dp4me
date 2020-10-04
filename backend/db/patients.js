const db = require("../pool.js");

const getAllPatients = async () => {
    let res = await db.query('SELECT * FROM patients');
    return res.rows;
}

module.exports = {
    getAllPatients,
}