import { ClientSession } from "mongoose";

export const abortAndError = async (transaction: ClientSession, error: Error | string) => {
    await transaction.abortTransaction();
    throw error;
};
