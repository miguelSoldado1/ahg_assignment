import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { note, patient } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const createNoteSchema = z.object({
  patientId: z.uuid("Invalid patient ID format"),
  title: z.string().min(1, "Note title is required").max(200, "Title is too long"),
  content: z.string().min(1, "Note content is required").max(10000, "Note content is too long"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = createNoteSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid input", details: validatedData.error }, { status: 400 });
    }

    const [existingPatient] = await db.select().from(patient).where(eq(patient.id, validatedData.data.patientId)).limit(1);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const [newNote] = await db.insert(note).values(validatedData.data).returning();
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
