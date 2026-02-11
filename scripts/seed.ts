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
    {
      patientId: patients[0].id,
      title: "Medication Tolerance Check",
      content:
        "No adverse effects from Lisinopril reported. Renal function stable. Continue therapy and monitor electrolytes.",
    },
    {
      patientId: patients[0].id,
      title: "Dietary Counseling",
      content: "Discussed DASH diet and salt reduction. Provided handout and local nutritionist referral.",
    },
    {
      patientId: patients[0].id,
      title: "Exercise Plan Update",
      content: "Patient started walking 30 minutes daily. Endurance improving, BP trending downward.",
    },
    {
      patientId: patients[0].id,
      title: "Telehealth Check-in",
      content: "Virtual visit to review home BP logs. Continue current regimen; escalate if readings rise.",
    },
    {
      patientId: patients[0].id,
      title: "Pre-Op Clearance",
      content: "Cleared for minor procedure. BP controlled. No additional pre-op testing required.",
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
    {
      patientId: patients[1].id,
      title: "Vaccination Follow-up",
      content: "Administered second dose of shingles vaccine. Tolerated well with mild injection site soreness.",
    },
    {
      patientId: patients[1].id,
      title: "Allergy Testing",
      content: "Skin-prick testing performed for seasonal allergies. Positive for ragweed; started antihistamine PRN.",
    },
    {
      patientId: patients[1].id,
      title: "Routine Bloodwork",
      content: "CBC and CMP within normal ranges. Advised routine screening labs annually.",
    },
    {
      patientId: patients[1].id,
      title: "Pap Smear Results",
      content: "Pap smear normal. HPV negative. Continue screening per guidelines.",
    },
    {
      patientId: patients[1].id,
      title: "Lifestyle Counseling",
      content: "Discussed stress management and sleep hygiene. Recommended cognitive behavioral resources.",
    },
    {
      patientId: patients[1].id,
      title: "Referral - Physical Therapy",
      content: "Referred for chronic neck pain. PT evaluation scheduled.",
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
    {
      patientId: patients[2].id,
      title: "Nutrition Counseling",
      content:
        "Met with nutritionist to set carbohydrate goals and meal planning. Patient given glucose monitoring targets.",
    },
    {
      patientId: patients[2].id,
      title: "Medication Side-effect Review",
      content: "Reported mild GI upset after Metformin; advised to take with food and slow uptitration.",
    },
    {
      patientId: patients[2].id,
      title: "A1c Follow-up",
      content: "HbA1c now 6.7%. Continue current regimen and monitor monthly glucose logs.",
    },
    {
      patientId: patients[2].id,
      title: "Vaccination - Influenza",
      content: "Administered flu vaccine. Reminded about pneumococcal vaccines per age guidelines.",
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
    {
      patientId: patients[3].id,
      title: "Allergy Review",
      content: "Seasonal allergies suspected; started on intranasal steroid and oral antihistamine as needed.",
    },
    {
      patientId: patients[3].id,
      title: "Imaging Results",
      content: "Chest X-ray normal; no focal consolidation. Continue symptomatic care.",
    },
    {
      patientId: patients[3].id,
      title: "Smoking Cessation Counseling",
      content: "Discussed risks and cessation options. Provided resources and follow-up plan.",
    },
    {
      patientId: patients[3].id,
      title: "RT Follow-up - Asthma Action Plan",
      content: "Reviewed inhaler technique and provided written asthma action plan.",
    },
    {
      patientId: patients[3].id,
      title: "Wellness Visit",
      content: "Routine wellness checks normal. Recommended annual immunizations and routine screening.",
    },
    {
      patientId: patients[3].id,
      title: "Telehealth Symptom Check",
      content: "Short telehealth visit; symptoms stable. Continue PRN inhaler and follow-up if worsens.",
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
    {
      patientId: patients[4].id,
      title: "PT Progress Note",
      content: "Strengthening exercises progressing. Quad strength improving; continue home program.",
    },
    {
      patientId: patients[4].id,
      title: "MRI Results",
      content: "MRI shows no major ligament tear; mild sprain confirmed. Continue conservative management.",
    },
    {
      patientId: patients[4].id,
      title: "Return-to-Play Clearance",
      content: "Cleared for non-contact training. Gradual return-to-play protocol outlined.",
    },
    {
      patientId: patients[4].id,
      title: "Injury Prevention Counseling",
      content: "Discussed knee stabilization exercises and proper footwear.",
    },
    {
      patientId: patients[4].id,
      title: "Follow-up Call",
      content: "Brief call to confirm recovery and adherence to home exercises. No new complaints.",
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
