import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note, patient } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const patientIdSchema = z.uuid("Invalid patient ID format");

export async function GET(_request: Request, context: { params: Promise<{ patientId: string }> }) {
  try {
    const { patientId } = await context.params;
    const validatedId = patientIdSchema.safeParse(patientId);
    if (!validatedId.success) {
      return NextResponse.json({ error: "Invalid patient ID", details: validatedId.error }, { status: 400 });
    }

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, validatedId.data)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const notes = await db
      .select()
      .from(note)
      .where(eq(note.patientId, validatedId.data))
      .orderBy(desc(note.createdAt));
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}
