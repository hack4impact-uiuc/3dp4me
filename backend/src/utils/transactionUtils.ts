import { ClientSession } from "mongoose";

export const abortAndError = async (transaction: ClientSession, error: Error) => {
    await transaction.abortTransaction();
    throw error;
};
