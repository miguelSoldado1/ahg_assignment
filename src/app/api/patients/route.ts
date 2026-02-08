import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { patient } from "@/db/schema";

export async function GET() {
  try {
    const patients = await db.select().from(patient).orderBy(patient.name);
    return NextResponse.json(patients);
  } catch (error) {
    console.error("Failed to fetch patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}
