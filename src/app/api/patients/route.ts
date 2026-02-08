import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { patient } from "@/db/schema";
import { z } from "zod";

export async function GET() {
  try {
    const patients = await db.select().from(patient).orderBy(patient.name);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

const createPatientSchema = z.object({
  name: z.string().min(1, "Patient name is required").max(100, "Name is too long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createPatientSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const [newPatient] = await db.insert(patient).values(validatedData.data).returning();
    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error("Failed to create patient:", error);
    return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
  }
}
