import { db } from "../src/db/drizzle";
import { note, patient } from "../src/db/schema";

async function seed() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  console.log("Clearing existing data...");
  await db.delete(note);
  await db.delete(patient);

  // Insert patients
  console.log("Creating patients...");
  const patients = await db
    .insert(patient)
    .values([
      { name: "John Doe" },
      { name: "Jane Smith" },
      { name: "Robert Johnson" },
      { name: "Emily Davis" },
      { name: "Michael Brown" },
    ])
    .returning();

  console.log(`✓ Created ${patients.length} patients`);

  // Insert notes for each patient
  console.log("Creating notes...");
  const notesData = [
    // John Doe's notes
    {
      patientId: patients[0].id,
      title: "Initial Consultation",
      content:
        "Patient presents with mild hypertension. Blood pressure reading: 145/92. Started on Lisinopril 10mg daily. Advised lifestyle modifications including diet and exercise. Follow-up in 4 weeks.",
    },
    {
      patientId: patients[0].id,
      title: "Follow-up Visit",
      content:
        "Blood pressure improved to 135/85. Patient reports adherence to medication and diet changes. Continue current treatment plan. Follow-up in 8 weeks.",
    },
    {
      patientId: patients[0].id,
      title: "Lab Results Review",
      content:
        "Lipid panel shows LDL at 145 mg/dL, HDL at 42 mg/dL. Discussed addition of statin therapy. Patient agreed to start Atorvastatin 20mg at bedtime. Recheck labs in 3 months.",
    },

    // Jane Smith's notes
    {
      patientId: patients[1].id,
      title: "Annual Physical Examination",
      content:
        "Complete physical examination performed. All systems within normal limits. Updated vaccinations including flu shot. Discussed importance of regular exercise and balanced diet. Next annual exam in 12 months.",
    },
    {
      patientId: patients[1].id,
      title: "Dermatology Referral",
      content:
        "Patient noted suspicious mole on left shoulder. Referred to dermatology for evaluation. Scheduled appointment for next week. Advised to monitor for changes.",
    },

    // Robert Johnson's notes
    {
      patientId: patients[2].id,
      title: "Diabetes Diagnosis",
      content:
        "HbA1c: 7.8%. Diagnosed with Type 2 Diabetes. Started on Metformin 500mg twice daily. Comprehensive diabetes education provided. Referral to diabetes educator and nutritionist. Self-monitoring blood glucose ordered.",
    },
    {
      patientId: patients[2].id,
      title: "Diabetes Management Review",
      content:
        "Patient adjusting well to Metformin. Blood glucose logs show improved control. HbA1c decreased to 6.9%. Increased Metformin to 1000mg twice daily. Continue lifestyle modifications.",
    },
    {
      patientId: patients[2].id,
      title: "Foot Examination",
      content:
        "Annual diabetic foot exam performed. Monofilament test normal. No signs of neuropathy or ulceration. Foot care education reinforced. Continue daily foot inspections at home.",
    },
    {
      patientId: patients[2].id,
      title: "Eye Exam Referral",
      content:
        "Due for annual diabetic retinopathy screening. Referred to ophthalmology. Patient scheduled appointment for next month. Emphasized importance of regular eye exams.",
    },

    // Emily Davis's notes
    {
      patientId: patients[3].id,
      title: "Urgent Care Visit - Respiratory Infection",
      content:
        "Patient presents with cough, fever (101.5°F), and congestion for 3 days. Physical exam reveals wheezing and decreased breath sounds bilaterally. Diagnosed with acute bronchitis. Prescribed Azithromycin Z-pack and albuterol inhaler. Return if symptoms worsen.",
    },
    {
      patientId: patients[3].id,
      title: "Follow-up - Respiratory Infection",
      content:
        "Patient reports significant improvement. Fever resolved. Cough decreasing. Lungs clear on auscultation. Completed antibiotic course. No further treatment needed at this time.",
    },

    // Michael Brown's notes
    {
      patientId: patients[4].id,
      title: "Sports Physical",
      content:
        "19-year-old male presents for pre-participation sports physical. History and physical examination unremarkable. Vision and hearing tests normal. Cleared for all sports activities. Discussed injury prevention and proper warm-up techniques.",
    },
    {
      patientId: patients[4].id,
      title: "Knee Injury Evaluation",
      content:
        "Patient injured knee during basketball game. Moderate swelling and tenderness over medial joint line. McMurray test negative. Likely MCL sprain. Prescribed RICE protocol and NSAIDs. Sports activity restricted for 2-3 weeks. Physical therapy referral provided.",
    },
    {
      patientId: patients[4].id,
      title: "Knee Injury Follow-up",
      content:
        "Patient completing physical therapy with good progress. Range of motion improved to 95%. Minimal pain with activity. Gradual return to sports activities approved. Continue strengthening exercises. Follow-up PRN.",
    },
  ];

  const notes = await db.insert(note).values(notesData).returning();

  console.log(`✓ Created ${notes.length} notes`);
  console.log("\n📊 Summary:");
  console.log(`  Patients: ${patients.length}`);
  console.log(`  Notes: ${notes.length}`);
  console.log("\n✨ Seeding completed successfully!");
}

seed()
  .catch((error) => {
    console.error("❌ Seeding failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
