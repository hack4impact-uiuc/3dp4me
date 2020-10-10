// All db related functions should show up in files here. The file name should be the same as the filename where the api endpoint using this is located.
// always needed
const db = require("../pool.js");

const getAll = async () => {
    // query here
    let res = await db.query('SELECT *');
    return res.rows;
}

module.exports = {
    getAll,
}