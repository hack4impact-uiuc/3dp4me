const { Patient } = require('../models/Patient');

const ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const STARTING_YEAR = 2023;

const generateOrderId = async (session) => {
    const currentYear = new Date().getFullYear();
    const numOrdersInYear = await Patient.countDocuments({ orderYear: currentYear }, { session });
    return `${getYearLetter()}${numOrdersInYear + 1}`;
};

// TODO: Write some quick tests for this
const getYearLetter = () => {
    const year = new Date().getFullYear();
    return ALPHABET[(year - STARTING_YEAR) % ALPHABET.length];
};

module.exports = {
    generateOrderId,
};
