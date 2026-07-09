import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB || "clinic_db";

const client = new MongoClient(uri);

let db;

export async function connectToMongo() {
  if (db) return db;
  await client.connect();
  db = client.db(dbName);
  console.log(`✅ MongoDB connected to ${dbName}`);

  // Ensure patients collection exists and email is unique
  try {
    await db.collection("patients").createIndex({ email: 1 }, { unique: true });
  } catch (indexErr) {
    console.error("❌ Failed to create patients index:", indexErr.message);
  }

  // Auto-seed specialities if empty
  try {
    const specsCollection = db.collection("specialities");
    const count = await specsCollection.countDocuments();
    const generalSpecialties = [
      'Family Medicine',
      'Preventive Care',
      'Pediatric Care',
      'Women\'s Health',
    ];
    const dentalSpecialties = [
      'Dental Care',
      'Facial Care',
      'Dental Implants',
    ];

    if (count === 0) {
      console.log("Empty specialities collection. Seeding initial data...");
      const initialSpecialities = [
        { name: 'Family Medicine', description: 'Comprehensive primary care for all ages — from newborns to seniors.', icon: 'Heart', doctor_name: 'Dr. Kavi Priya', available: true },
        { name: 'Dental Care',     description: 'Complete dental solutions including cleanings, fillings, and extractions.', icon: 'Smile', doctor_name: 'Dr. Thennarasu', available: true },
        { name: 'Facial Care',     description: 'Specialized facial treatments and non-surgical cosmetic procedures.', icon: 'Sparkles', doctor_name: 'Dr. Thennarasu', available: true },
        { name: 'Dental Implants', description: 'Permanent tooth replacement that looks and feels like natural teeth.', icon: 'Shield', doctor_name: 'Dr. Thennarasu', available: true },
        { name: 'Preventive Care', description: 'Health screenings, vaccinations, and wellness check-ups.', icon: 'Activity', doctor_name: 'Dr. Kavi Priya', available: true },
        { name: 'Pediatric Care',  description: 'Gentle child-friendly healthcare — growth monitoring and immunizations.', icon: 'Baby', doctor_name: 'Dr. Kavi Priya', available: true },
        { name: 'Women\'s Health', description: 'Gynaecology, reproductive health, and wellness check-ups for women.', icon: 'Users', doctor_name: 'Dr. Kavi Priya', available: true },
        { name: 'General Surgery', description: 'Minor surgical procedures and wound care in a safe clinical environment.', icon: 'Stethoscope', doctor_name: 'Dr. Thennarasu', available: true }
      ];
      await specsCollection.insertMany(initialSpecialities);
      console.log("✅ Initial specialities seeded successfully!");
    }

    const doctorAssignments = {
      'Family Medicine': 'Dr. Kavi Priya',
      'Preventive Care': 'Dr. Kavi Priya',
      'Pediatric Care': 'Dr. Kavi Priya',
      "Women's Health": 'Dr. Kavi Priya',
      'Dental Care': 'Dr. Thennarasu',
      'Facial Care': 'Dr. Thennarasu',
      'Dental Implants': 'Dr. Thennarasu',
    };

    for (const [name, doctor_name] of Object.entries(doctorAssignments)) {
      await specsCollection.updateOne(
        { name },
        { $set: { doctor_name } }
      );
    }
  } catch (seedErr) {
    console.error("❌ Failed to seed specialities:", seedErr.message);
  }

  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("MongoDB not initialized. Call connectToMongo first.");
  }
  return db;
}

export function getCollection(name) {
  return getDb().collection(name);
}
