// gets directly from PatientModel from Patient to double check that make_patientcsv is getting all the patientss

import { initDB } from '../src/utils/initDb';
import { PatientModel } from '../src/models/Patient';

async function main() {
  await initDB(); // uses Doppler-managed MONGO_URI
  console.log('✅ DB connected');

  const patients = await PatientModel.find(); // no `.lean()` so encryption is handled
  console.log('🧾 Found patients:', patients.length);

  for (const p of patients) {
    console.log('👤', {
      orderId: p.orderId,
      name: `${p.firstName} ${p.fathersName} ${p.familyName}`,
      phone: p.phoneNumber,
      status: p.status,
    });
  }

  // Optional: show full raw object of first patient
  console.log('\n🔍 Full data of first patient:\n', patients[0].toObject());
}

main().catch(err => {
  console.error('❌ Error:', err);
});
