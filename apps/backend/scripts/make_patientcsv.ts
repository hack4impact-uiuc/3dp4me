import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import mongoose from 'mongoose';
import { PatientModel } from '../src/models/Patient'; 
import { initDB } from "../src/utils/initDb";

export async function main() {
    await initDB();
    //console.log('URI from env:', process.env.MONGO_URI);
    console.log("db initialized");

    const patients = await PatientModel.find();
    const patientRecords = patients.map(p => {
      const obj = p.toObject();

      return {
        ...obj,
        dateCreated: obj.dateCreated?.toISOString().slice(0, 10),
        lastEdited: obj.lastEdited?.toISOString().slice(0, 10),
      };
    });
    
    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, 'patients.csv'),
      header: [
        { id: 'dateCreated', title: 'Date Created' },
        { id: 'orderId', title: 'Order ID' },
        { id: 'lastEdited', title: 'Last Edited' },
        { id: 'lastEditedBy', title: 'Last Edited By' },
        { id: 'status', title: 'Status' },
        { id: 'phoneNumber', title: 'Phone Number' },
        { id: 'orderYear', title: 'Order Year' },
        { id: 'firstName', title: 'First Name' },
        { id: 'fathersName', title: 'Father\'s Name' },
        { id: 'grandfathersName', title: 'Grandfather\'s Name' },
        { id: 'familyName', title: 'Family Name' },
      ]
    });

    await csvWriter.writeRecords(patientRecords);
    console.log('patients.csv generated!');
    await mongoose.disconnect();
  }

  main().catch(err => {
    console.error('error generating CSV:', err);
  });
