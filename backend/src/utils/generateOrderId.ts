/* eslint-disable no-await-in-loop */
import pad from 'pad';
import { Patient, PatientModel } from '../models/Patient';
import { ClientSession } from 'mongoose';

const ALPHABET = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
];
const STARTING_YEAR = 2023;

export const generateOrderId = async (session: ClientSession) => {
    const currentYear = new Date().getFullYear();
    const numOrdersInYear = await PatientModel.count({ orderYear: currentYear });
    let offset = 1;

    // while true should be fine, but this is just a failsafe
    while (offset < 100000) {
        // Generate the order ID
        const orderNumber = numOrdersInYear + offset;
        const paddedOrderNumber = pad(5, orderNumber.toString(), '0');
        const orderId = `${getYearLetter()}${paddedOrderNumber}`;

        // See if a patient already has this ID
        const patientWithId = await PatientModel.findOne(
            { orderId },
            {},
            { session },
        );
        if (!patientWithId) return orderId;

        // If a patient already has that ID, we try to up the order number by one
        offset++;
    }

    throw new Error('Could not generate order ID');
};

const getYearLetter = () => {
    const year = new Date().getFullYear();
    return ALPHABET[(year - STARTING_YEAR) % ALPHABET.length];
};