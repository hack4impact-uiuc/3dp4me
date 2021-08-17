module.exports.abortAndError = async (transaction, error) => {
    await transaction.abortTransaction();
    throw error;
};
