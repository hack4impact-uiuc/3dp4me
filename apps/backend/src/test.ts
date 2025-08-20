import { initDB } from "utils/initDb";
import { PatientModel } from "./models/Patient";


export async function main() {
    console.log("db initialized");

    const patients = await PatientModel.find().lean();
    console.log(patients);
}


